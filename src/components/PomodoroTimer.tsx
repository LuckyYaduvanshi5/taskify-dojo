
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

type TimerMode = 'focus' | 'break';

const PomodoroTimer = () => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isActive, setIsActive] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const intervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  // Calculate progress percentage
  const totalTime = mode === 'focus' ? focusDuration * 60 : breakDuration * 60;
  const progress = 100 - (timeLeft / totalTime) * 100;
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle timer toggle
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  // Reset timer
  const resetTimer = () => {
    clearInterval(intervalRef.current!);
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };
  
  // Switch between focus and break modes
  const toggleMode = () => {
    const newMode = mode === 'focus' ? 'break' : 'focus';
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? focusDuration * 60 : breakDuration * 60);
    setIsActive(false);
  };
  
  // Timer effect
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(intervalRef.current!);
      setIsActive(false);
      
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
      
      // Show notification
      toast({
        title: mode === 'focus' ? "Focus time completed!" : "Break time completed!",
        description: mode === 'focus' 
          ? "Great job! Take a break now." 
          : "Break finished! Ready to focus again?",
      });
      
      // Switch modes
      toggleMode();
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, mode, focusDuration, breakDuration, toast]);
  
  return (
    <Card className="w-full max-w-sm mx-auto bg-card/50 backdrop-blur-sm border-2 border-primary/20 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-6 text-center">
          {mode === 'focus' ? 'Focus Time' : 'Break Time'}
        </h2>
        
        <div className="relative flex justify-center mb-8">
          <div className="w-48 h-48 rounded-full bg-card flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <Progress
                value={progress}
                className="w-full h-full absolute rounded-full"
                indicatorClassName={cn(
                  "rounded-full transition-all",
                  mode === 'focus' ? "bg-primary/20" : "bg-cyan-500/20"
                )}
              />
            </div>
            <div className="z-10 bg-background/80 backdrop-blur-sm rounded-full w-40 h-40 flex items-center justify-center">
              <span className="text-4xl font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-3 mb-6 w-full">
          <Button
            onClick={toggleTimer}
            variant="outline"
            size="icon"
            className={cn(
              "w-14 h-14 rounded-full transition-all",
              isActive 
                ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60" 
                : "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60"
            )}
          >
            {isActive ? <Pause size={24} /> : <Play size={24} />}
          </Button>
          
          <Button
            onClick={resetTimer}
            variant="outline"
            size="icon"
            className="w-14 h-14 rounded-full bg-secondary/50 hover:bg-secondary/80"
          >
            <RotateCcw size={24} />
          </Button>
          
          <Button
            onClick={toggleMode}
            variant="outline"
            size="icon"
            className={cn(
              "w-14 h-14 rounded-full transition-all",
              mode === 'break' 
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground" 
                : "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-300 hover:bg-cyan-200 dark:hover:bg-cyan-900/60"
            )}
          >
            <Coffee size={24} />
          </Button>
        </div>
        
        <div className="w-full space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Focus Duration: {focusDuration} min</span>
            </div>
            <Slider
              value={[focusDuration]}
              min={5}
              max={60}
              step={5}
              onValueChange={([value]) => {
                setFocusDuration(value);
                if (mode === 'focus' && !isActive) {
                  setTimeLeft(value * 60);
                }
              }}
              disabled={isActive}
              className={cn(
                "h-2", 
                mode === 'focus' ? "bg-primary/20" : undefined
              )}
            />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Break Duration: {breakDuration} min</span>
            </div>
            <Slider
              value={[breakDuration]}
              min={1}
              max={30}
              step={1}
              onValueChange={([value]) => {
                setBreakDuration(value);
                if (mode === 'break' && !isActive) {
                  setTimeLeft(value * 60);
                }
              }}
              disabled={isActive}
              className={cn(
                "h-2",
                mode === 'break' ? "bg-cyan-500/20" : undefined
              )}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PomodoroTimer;
