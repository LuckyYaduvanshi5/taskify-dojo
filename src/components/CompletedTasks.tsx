
import { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import TaskCard from '@/components/TaskCard';
import { Task } from '@/lib/types';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface CompletedTasksProps {
  onEditTask: (task: Task) => void;
}

const CompletedTasks = ({ onEditTask }: CompletedTasksProps) => {
  const { tasks } = useTask();
  const [isOpen, setIsOpen] = useState(false);
  
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  if (completedTasks.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6 mb-16">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full flex items-center justify-between p-3 bg-card rounded-lg mb-2 border border-border">
          <div className="flex items-center">
            <CheckCircle className="mr-2 text-green-500" size={18} />
            <h3 className="font-medium">Completed Tasks ({completedTasks.length})</h3>
          </div>
          <div>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className={cn(
          "overflow-hidden transition-all",
          isOpen ? "animate-accordion-down" : "animate-accordion-up"
        )}>
          <div className="space-y-1 mt-2">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CompletedTasks;
