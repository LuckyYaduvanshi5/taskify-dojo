
import { Task } from '@/lib/types';
import { format } from 'date-fns';
import { CheckCircle, Clock, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTask } from '@/contexts/TaskContext';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { removeTask, markTaskAsCompleted } = useTask();
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  
  // Format the due date
  const formattedDueDate = format(new Date(task.dueDate), 'PPP');
  
  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    // Limit swipe range
    if (diff < -100) {
      setSwipeOffset(-100);
    } else if (diff > 100) {
      setSwipeOffset(100);
    } else {
      setSwipeOffset(diff);
    }
  };
  
  const handleTouchEnd = () => {
    // If swiped far enough, trigger action
    if (swipeOffset <= -80) {
      // Swiped left - delete
      removeTask(task.id);
    } else if (swipeOffset >= 80) {
      // Swiped right - mark as completed
      markTaskAsCompleted(task.id);
    }
    
    // Reset swipe
    setSwipeOffset(0);
  };
  
  return (
    <div className="relative overflow-hidden mb-3 rounded-lg">
      {/* Swipe action indicators */}
      <div className="swipe-action-left">
        <CheckCircle size={24} />
      </div>
      <div className="swipe-action-right">
        <Trash2 size={24} />
      </div>
      
      {/* Task card */}
      <div 
        className={cn(
          "task-card p-4 relative z-10 bg-card",
          task.status === 'completed' && "opacity-70"
        )}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className={`priority-indicator priority-${task.priority}`} />
            <h3 className={cn(
              "font-medium text-lg",
              task.status === 'completed' && "line-through"
            )}>
              {task.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(task)}
              className="p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Edit task"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => removeTask(task.id)}
              className="p-1 rounded-full hover:bg-muted transition-colors text-destructive"
              aria-label="Delete task"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        {task.description && (
          <p className={cn(
            "text-muted-foreground mb-3 text-sm",
            task.status === 'completed' && "line-through"
          )}>
            {task.description}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{formattedDueDate}</span>
          </div>
          
          <span className={cn(
            "px-2 py-1 rounded-full text-xs",
            task.status === 'pending' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            task.status === 'in-progress' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            task.status === 'completed' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          )}>
            {task.status.replace('-', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
