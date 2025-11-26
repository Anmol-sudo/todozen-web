'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { Focus, Trash2 } from 'lucide-react';
import type { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type TaskItemProps = {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onSetFocus: (task: Task) => void;
};

export function TaskItem({ task, onToggleComplete, onDelete, onSetFocus }: TaskItemProps) {
  
  const getPriorityClass = (priority: number | null) => {
    if (priority === null) return 'border-transparent';
    if (priority <= 3) return 'border-destructive';
    if (priority <= 7) return 'border-chart-1';
    return 'border-chart-2';
  };

  const getDueDateText = () => {
    if (!task.dueDate) return null;
    if (task.dueTime) {
      return `Due ${format(task.dueDate, 'PPp')}`
    }
    return `Due ${formatDistanceToNow(task.dueDate, { addSuffix: true })}`;
  }


  return (
    <Card className={cn(
      'transition-all duration-300 ease-in-out hover:shadow-lg animate-in fade-in-0 zoom-in-95',
      task.completed ? 'bg-card/60' : 'bg-card',
      'border-l-4',
      getPriorityClass(task.priority)
    )}>
      <CardContent className="p-4 flex items-center gap-4">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          className="size-6 rounded-full transition-all"
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
        />
        <div className="flex-grow grid gap-1">
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              'font-medium transition-colors cursor-pointer',
              task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
            )}
          >
            {task.description}
          </label>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {task.dueDate && !task.completed && (
              <span className="text-xs">
                {getDueDateText()}
              </span>
            )}
            {task.priority && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="cursor-help font-normal">P: {task.priority}</Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="max-w-xs">{task.reason || 'AI-assigned priority'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!task.completed && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => onSetFocus(task)}>
                    <Focus className="size-4" />
                    <span className="sr-only">Focus on task</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Focus on this task</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
                  <Trash2 className="size-4 text-muted-foreground hover:text-destructive transition-colors" />
                  <span className="sr-only">Delete task</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
