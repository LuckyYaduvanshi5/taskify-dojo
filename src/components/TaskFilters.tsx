
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTask } from '@/contexts/TaskContext';
import { Priority, Status, SortOption } from '@/lib/types';
import { Filter, X, ArrowUpDown } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TaskFilters = () => {
  const { 
    filter, 
    setFilter, 
    sortOption, 
    setSortOption, 
    sortDirection, 
    setSortDirection 
  } = useTask();
  
  const [isOpen, setIsOpen] = useState(false);
  const [localPriority, setLocalPriority] = useState<Priority | undefined>(filter.priority);
  const [localStatus, setLocalStatus] = useState<Status | undefined>(filter.status);
  const [localSearchTerm, setLocalSearchTerm] = useState<string | undefined>(filter.searchTerm);
  
  // Count active filters
  const activeFilterCount = [
    filter.priority,
    filter.status,
    filter.searchTerm
  ].filter(Boolean).length;
  
  const handleApplyFilters = () => {
    setFilter({
      priority: localPriority,
      status: localStatus,
      searchTerm: localSearchTerm
    });
    setIsOpen(false);
  };
  
  const handleClearFilters = () => {
    setLocalPriority(undefined);
    setLocalStatus(undefined);
    setLocalSearchTerm(undefined);
    setFilter({});
    setIsOpen(false);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter size={16} />
              Filter
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filter Tasks</SheetTitle>
            </SheetHeader>
            
            <div className="py-4 space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search in title or description"
                  value={localSearchTerm || ''}
                  onChange={(e) => setLocalSearchTerm(e.target.value || undefined)}
                />
              </div>
              
              {/* Priority Filter */}
              <div className="space-y-2">
                <Label>Priority</Label>
                <RadioGroup 
                  value={localPriority} 
                  onValueChange={(value) => setLocalPriority(value as Priority || undefined)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="filter-low" />
                    <Label htmlFor="filter-low" className="text-task-low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="filter-medium" />
                    <Label htmlFor="filter-medium" className="text-task-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="filter-high" />
                    <Label htmlFor="filter-high" className="text-task-high">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="filter-any-priority" />
                    <Label htmlFor="filter-any-priority">Any priority</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Status Filter */}
              <div className="space-y-2">
                <Label>Status</Label>
                <RadioGroup 
                  value={localStatus} 
                  onValueChange={(value) => setLocalStatus(value as Status || undefined)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pending" id="filter-pending" />
                    <Label htmlFor="filter-pending">Pending</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-progress" id="filter-progress" />
                    <Label htmlFor="filter-progress">In Progress</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="completed" id="filter-completed" />
                    <Label htmlFor="filter-completed">Completed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="filter-any-status" />
                    <Label htmlFor="filter-any-status">Any status</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
              <div className="flex w-full space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleClearFilters}
                >
                  <X size={16} className="mr-1" />
                  Clear
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        {/* Display active filters */}
        <div className="flex gap-1 flex-wrap">
          {filter.priority && (
            <Badge variant="outline" className="flex items-center gap-1">
              Priority: {filter.priority}
              <button onClick={() => setFilter({ ...filter, priority: undefined })}>
                <X size={12} />
              </button>
            </Badge>
          )}
          
          {filter.status && (
            <Badge variant="outline" className="flex items-center gap-1">
              Status: {filter.status.replace('-', ' ')}
              <button onClick={() => setFilter({ ...filter, status: undefined })}>
                <X size={12} />
              </button>
            </Badge>
          )}
          
          {filter.searchTerm && (
            <Badge variant="outline" className="flex items-center gap-1">
              "{filter.searchTerm}"
              <button onClick={() => setFilter({ ...filter, searchTerm: undefined })}>
                <X size={12} />
              </button>
            </Badge>
          )}
        </div>
      </div>
      
      {/* Sort options */}
      <div className="flex items-center gap-2">
        <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="createdAt">Created Date</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSortDirection}
          title={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
        >
          <ArrowUpDown size={16} className={sortDirection === 'desc' ? 'rotate-180' : ''} />
        </Button>
      </div>
    </div>
  );
};

export default TaskFilters;
