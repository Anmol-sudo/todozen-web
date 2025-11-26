export type Task = {
  id: string;
  description: string;
  dueDate: Date | null;
  dueTime: string | null;
  completed: boolean;
  priority: number | null;
  reason: string | null;
};
