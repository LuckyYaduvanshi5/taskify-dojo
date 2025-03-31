
import { Task, AppSettings } from './types';

const TASKS_STORAGE_KEY = 'taskify-tasks';
const SETTINGS_STORAGE_KEY = 'taskify-settings';

// Task Storage Functions
export const getTasks = (): Task[] => {
  try {
    const tasksJson = localStorage.getItem(TASKS_STORAGE_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error('Failed to get tasks from localStorage:', error);
    return [];
  }
};

export const saveTask = (task: Task): void => {
  try {
    const tasks = getTasks();
    const existingTaskIndex = tasks.findIndex(t => t.id === task.id);
    
    if (existingTaskIndex >= 0) {
      // Update existing task
      tasks[existingTaskIndex] = {
        ...task,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new task
      tasks.push(task);
    }
    
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save task to localStorage:', error);
  }
};

export const deleteTask = (taskId: string): void => {
  try {
    const tasks = getTasks();
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  } catch (error) {
    console.error('Failed to delete task from localStorage:', error);
  }
};

export const clearCompletedTasks = (): void => {
  try {
    const tasks = getTasks();
    const updatedTasks = tasks.filter(task => task.status !== 'completed');
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  } catch (error) {
    console.error('Failed to clear completed tasks from localStorage:', error);
  }
};

export const resetAllTasks = (): void => {
  try {
    localStorage.removeItem(TASKS_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset tasks in localStorage:', error);
  }
};

// Settings Storage Functions
export const getSettings = (): AppSettings => {
  try {
    const settingsJson = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return settingsJson 
      ? JSON.parse(settingsJson) 
      : { theme: 'system' };
  } catch (error) {
    console.error('Failed to get settings from localStorage:', error);
    return { theme: 'system' };
  }
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
};
