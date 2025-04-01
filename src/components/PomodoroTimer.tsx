
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
    <div className="bg-card p-4 rounded-xl shadow-md animate-fade-in border border-border">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {mode === 'focus' ? 'Focus Time' : 'Break Time'}
      </h2>
      
      <div className="relative flex justify-center my-6">
        <div className="w-36 h-36 rounded-full bg-muted flex items-center justify-center">
          <Progress
            value={progress}
            className="w-36 h-36 rounded-full absolute"
            indicatorClassName={cn(
              "rounded-full transition-all",
              mode === 'focus' ? "bg-primary/30" : "bg-cyan-500/30"
            )}
          />
          <span className="text-3xl font-bold z-10">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      
      <div className="flex justify-center gap-2 mb-4">
        <Button
          onClick={toggleTimer}
          variant="outline"
          size="icon"
          className={cn(
            "w-12 h-12 rounded-full",
            isActive ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300" : 
            "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
          )}
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        
        <Button
          onClick={resetTimer}
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
        >
          <RotateCcw size={20} />
        </Button>
        
        <Button
          onClick={toggleMode}
          variant="outline"
          size="icon"
          className={cn(
            "w-12 h-12 rounded-full",
            mode === 'break' 
              ? "bg-primary/10 text-primary" 
              : "bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300"
          )}
        >
          <Coffee size={20} />
        </Button>
      </div>
      
      <div className="mt-4 space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Focus Duration: {focusDuration} min</span>
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
            className="my-2"
          />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Break Duration: {breakDuration} min</span>
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
            className="my-2"
          />
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
