
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Priority, Status, SortOption, SortDirection, TaskFilter } from '@/lib/types';
import { getTasks, saveTask, deleteTask, clearCompletedTasks, resetAllTasks } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  filter: TaskFilter;
  sortOption: SortOption;
  sortDirection: SortDirection;
  addTask: (title: string, description: string, priority: Priority, dueDate: string, status: Status) => void;
  updateTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  markTaskAsCompleted: (taskId: string) => void;
  clearCompleted: () => void;
  resetAll: () => void;
  setFilter: (filter: TaskFilter) => void;
  setSortOption: (option: SortOption) => void;
  setSortDirection: (direction: SortDirection) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>({});
  const [sortOption, setSortOption] = useState<SortOption>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = getTasks();
    setTasks(savedTasks);
  }, []);
  
  // Add new task
  const addTask = (title: string, description: string, priority: Priority, dueDate: string, status: Status) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      priority,
      dueDate,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveTask(newTask);
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Task added",
      description: "Your task has been successfully created"
    });
  };
  
  // Update existing task
  const updateTask = (updatedTask: Task) => {
    saveTask(updatedTask);
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? { ...updatedTask, updatedAt: new Date().toISOString() } : task
    ));
    toast({
      title: "Task updated",
      description: "Your task has been successfully updated"
    });
  };
  
  // Remove task
  const removeTask = (taskId: string) => {
    deleteTask(taskId);
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "Your task has been removed"
    });
  };
  
  // Mark task as completed
  const markTaskAsCompleted = (taskId: string) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (taskToUpdate) {
      const updatedTask = { ...taskToUpdate, status: 'completed' as Status };
      updateTask(updatedTask);
    }
  };
  
  // Clear completed tasks
  const clearCompleted = () => {
    clearCompletedTasks();
    setTasks(prev => prev.filter(task => task.status !== 'completed'));
    toast({
      title: "Completed tasks cleared",
      description: "All completed tasks have been removed"
    });
  };
  
  // Reset all tasks
  const resetAll = () => {
    resetAllTasks();
    setTasks([]);
    toast({
      title: "All tasks reset",
      description: "All tasks have been removed from the app"
    });
  };
  
  // Filter and sort tasks
  const filteredTasks = React.useMemo(() => {
    // Apply filters
    let result = [...tasks];
    
    if (filter.priority) {
      result = result.filter(task => task.priority === filter.priority);
    }
    
    if (filter.status) {
      result = result.filter(task => task.status === filter.status);
    }
    
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(term) || 
        task.description.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortOption) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'status':
          const statusOrder = { pending: 1, 'in-progress': 2, completed: 3 };
          comparison = statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'createdAt':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [tasks, filter, sortOption, sortDirection]);
  
  return (
    <TaskContext.Provider value={{
      tasks,
      filteredTasks,
      filter,
      sortOption,
      sortDirection,
      addTask,
      updateTask,
      removeTask,
      markTaskAsCompleted,
      clearCompleted,
      resetAll,
      setFilter,
      setSortOption,
      setSortDirection
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}
