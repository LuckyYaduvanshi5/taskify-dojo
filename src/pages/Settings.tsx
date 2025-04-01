
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sun, Moon, Monitor, Trash2, AlertTriangle, ExternalLink } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { clearCompleted, resetAll } = useTask();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-8">
        {/* Theme Settings */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Appearance</h2>
          <RadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 bg-card rounded-lg p-3 cursor-pointer">
              <RadioGroupItem value="light" id="theme-light" />
              <Label htmlFor="theme-light" className="flex items-center cursor-pointer">
                <Sun size={18} className="mr-2 text-yellow-500" />
                Light Mode
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-card rounded-lg p-3 cursor-pointer">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark" className="flex items-center cursor-pointer">
                <Moon size={18} className="mr-2 text-indigo-400" />
                Dark Mode
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-card rounded-lg p-3 cursor-pointer">
              <RadioGroupItem value="system" id="theme-system" />
              <Label htmlFor="theme-system" className="flex items-center cursor-pointer">
                <Monitor size={18} className="mr-2 text-gray-500" />
                System Default
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Data Management */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Data Management</h2>
          
          {/* Clear Completed Tasks */}
          <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between p-3 h-auto"
              >
                <span className="flex items-center">
                  <Trash2 size={18} className="mr-2 text-orange-500" />
                  Clear Completed Tasks
                </span>
                <span className="text-xs text-muted-foreground">
                  Remove all tasks marked as completed
                </span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Completed Tasks</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will remove all completed tasks from your task list. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => {
                    clearCompleted();
                    setShowClearDialog(false);
                  }}
                >
                  Clear Tasks
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          {/* Reset All Data */}
          <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between p-3 h-auto text-destructive border-destructive/20"
              >
                <span className="flex items-center">
                  <AlertTriangle size={18} className="mr-2" />
                  Reset All Data
                </span>
                <span className="text-xs text-muted-foreground">
                  Delete all tasks and reset app
                </span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset All Data</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete ALL tasks and reset the app to its initial state. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={() => {
                    resetAll();
                    setShowResetDialog(false);
                  }}
                >
                  Reset Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        {/* Credits Section */}
        <div className="space-y-3 pt-4 border-t">
          <h2 className="text-lg font-medium">Credits</h2>
          <div className="bg-card rounded-lg p-4">
            <div className="flex flex-col space-y-2">
              <p className="font-medium">Developed by Lucky Yaduvanshi</p>
              <a 
                href="https://miniai.online" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary flex items-center hover:underline"
              >
                miniai.online <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
        
        {/* App Info */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">Taskify v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">Your tasks are stored locally on this device</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
