
import { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import TaskCard from '@/components/TaskCard';
import TaskFilters from '@/components/TaskFilters';
import TaskForm from '@/components/TaskForm';
import { Task } from '@/lib/types';
import { ListX } from 'lucide-react';

const Index = () => {
  const { filteredTasks } = useTask();
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(undefined);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
      
      <TaskFilters />
      
      <div className="space-y-1">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={handleEditTask}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <ListX size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No tasks found</h3>
            <p className="text-muted-foreground text-sm">
              Add a new task or adjust your filters
            </p>
          </div>
        )}
      </div>
      
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
