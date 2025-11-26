'use client';

import { X } from 'lucide-react';
import type { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

type FocusViewProps = {
  task: Task;
  onExit: () => void;
};

export function FocusView({ task, onExit }: FocusViewProps) {
  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-500">
      <Card className="w-full max-w-2xl shadow-2xl animate-in zoom-in-90 duration-500">
        <CardHeader>
          <CardTitle className="text-3xl lg:text-5xl font-headline text-center font-bold">{task.description}</CardTitle>
          {task.dueDate && (
            <CardDescription className="text-center pt-2 text-base">
              Due: {format(task.dueDate, 'PPP')}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg text-muted-foreground mb-8">
            Take a deep breath. You can do this.
          </p>
          <Button onClick={onExit} size="lg">
            <X className="mr-2 h-5 w-5" />
            End Focus Session
          </Button>
        </CardContent>
      </Card>
      <button onClick={onExit} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground transition-colors">
        <X className="h-6 w-6" />
        <span className="sr-only">Exit Focus Mode</span>
      </button>
    </div>
  );
}
