
import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Settings, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import TaskForm from './TaskForm';

const AppLayout = () => {
  const location = useLocation();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Check for scroll to apply header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={cn(
        "w-full py-4 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-background",
        scrolled && "shadow-sm"
      )}>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          Taskify
        </h1>
      </header>
      
      {/* Main content */}
      <main className="flex-1 pt-16 pb-20 px-6 max-w-2xl mx-auto w-full">
        <Outlet />
      </main>
      
      {/* Floating action button */}
      <div className="fixed right-6 bottom-20 z-10">
        <Button 
          onClick={() => setIsTaskFormOpen(true)}
          className="h-14 w-14 rounded-full flex items-center justify-center shadow-lg bg-primary hover:bg-primary/90"
        >
          <Plus size={24} />
        </Button>
      </div>
      
      {/* Bottom navigation */}
      <footer className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t flex items-center justify-around z-50">
        <NavLink 
          to="/" 
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center text-xs w-full h-full",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Home size={20} />
          <span className="mt-1">Tasks</span>
        </NavLink>
        
        <NavLink 
          to="/settings"
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center text-xs w-full h-full",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Settings size={20} />
          <span className="mt-1">Settings</span>
        </NavLink>
      </footer>
      
      {/* Task form dialog */}
      <TaskForm 
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
      />
    </div>
  );
};

export default AppLayout;
