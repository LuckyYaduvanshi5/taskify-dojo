
import { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import TaskCard from '@/components/TaskCard';
import TaskFilters from '@/components/TaskFilters';
import TaskForm from '@/components/TaskForm';
import CompletedTasks from '@/components/CompletedTasks';
import PomodoroTimer from '@/components/PomodoroTimer';
import { Task } from '@/lib/types';
import { ListX, Clock, CheckCheck, ListTodo } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { filteredTasks } = useTask();
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(undefined);
  };
  
  const activeTasks = filteredTasks.filter(task => task.status !== 'completed');
  
  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="tasks" className="flex items-center">
            <ListTodo size={16} className="mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="pomodoro" className="flex items-center">
            <Clock size={16} className="mr-2" />
            Pomodoro
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="animate-fade-in">
          <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
          
          <TaskFilters />
          
          <div className="space-y-1 mt-4">
            {activeTasks.length > 0 ? (
              activeTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onEdit={handleEditTask}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <ListX size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No active tasks found</h3>
                <p className="text-muted-foreground text-sm">
                  Add a new task or adjust your filters
                </p>
              </div>
            )}
          </div>
          
          <CompletedTasks onEditTask={handleEditTask} />
        </TabsContent>
        
        <TabsContent value="pomodoro" className="animate-fade-in">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6">Pomodoro Timer</h1>
            <PomodoroTimer />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Edit Task Modal */}
      {editingTask && (
        <TaskForm
          task={editingTask}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
};

export default Index;
