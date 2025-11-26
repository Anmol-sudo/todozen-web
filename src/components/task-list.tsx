import type { Task } from '@/lib/types';
import { TaskItem } from './task-item';

type TaskListProps = {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onSetFocus: (task: Task) => void;
};

export function TaskList({ tasks, onToggleComplete, onDelete, onSetFocus }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg bg-card">
        <h3 className="text-lg font-medium text-muted-foreground">You're all done!</h3>
        <p className="text-sm text-muted-foreground">Add a new task above to get started.</p>
      </div>
    );
  }

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-4">
      {incompleteTasks.length > 0 && (
        <div className="space-y-2">
          {incompleteTasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggleComplete={onToggleComplete} onDelete={onDelete} onSetFocus={onSetFocus} />
          ))}
        </div>
      )}
      {completedTasks.length > 0 && incompleteTasks.length > 0 && (
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-xs uppercase text-muted-foreground tracking-wider">Completed</span>
          </div>
        </div>
      )}
      {completedTasks.length > 0 && (
        <div className="space-y-2">
          {completedTasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggleComplete={onToggleComplete} onDelete={onDelete} onSetFocus={onSetFocus} />
          ))}
        </div>
      )}
    </div>
  );
}
