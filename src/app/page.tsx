'use client';

import { useState, useMemo, useEffect } from 'react';
import { AppHeader } from '@/components/header';
import { TaskForm } from '@/components/task-form';
import { TaskList } from '@/components/task-list';
import { AIPrioritizer } from '@/components/ai-prioritizer';
import { FocusView } from '@/components/focus-view';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@/lib/types';
import { prioritizeTasks, type PrioritizeTasksInput } from '@/ai/flows/intelligent-task-prioritization';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const initialTasks: Task[] = [
    { id: '1', description: 'Finish the project proposal', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), dueTime: '17:00', completed: false, priority: null, reason: null },
    { id: '2', description: 'Buy groceries for the week', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), dueTime: null, completed: false, priority: null, reason: null },
    { id: '3', description: 'Schedule dentist appointment', dueDate: null, dueTime: null, completed: true, priority: null, reason: null },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusedTask, setFocusedTask] = useState<Task | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // This effect runs only on the client, after hydration
    const savedTasks = localStorage.getItem('todozen-tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks, (key, value) => {
          if (key === 'dueDate' && value) {
            return new Date(value);
          }
          return value;
        });
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Failed to parse tasks from localStorage", error);
        setTasks(initialTasks);
      }
    } else {
      setTasks(initialTasks);
    }
  }, []);

  useEffect(() => {
    // This effect runs only on the client
    if (tasks.length > 0) {
      localStorage.setItem('todozen-tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completed' | 'priority' | 'reason'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now().toString(),
      completed: false,
      priority: null,
      reason: null,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    toast({
      title: 'Task Added',
      description: `"${newTask.description}" has been added.`,
    });
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map(task => {
        if (task.id === id) {
          const updatedTask = { ...task, completed: !task.completed };
          return updatedTask;
        }
        return task;
      })
    );
  };
  
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: 'Task Deleted',
      description: 'The task has been removed from your list.',
    });
  };

  const handleSetFocus = (task: Task | null) => {
    setFocusedTask(task);
  };

  const handlePrioritizeTasks = async () => {
    const tasksToPrioritize = tasks.filter(task => !task.completed);
    if (tasksToPrioritize.length === 0) {
      toast({
        title: 'No tasks to prioritize',
        description: 'Add some tasks or uncheck completed ones.',
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const input: PrioritizeTasksInput = tasksToPrioritize.map(task => ({
        description: task.description,
        deadline: task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : 'none',
      }));
      
      const prioritizedResult = await prioritizeTasks(input);
      
      const updatedTasks = tasks.map(task => {
        const prioritized = prioritizedResult.find(p => p.description === task.description);
        if (prioritized && !task.completed) {
          return { ...task, priority: prioritized.priority, reason: prioritized.reason };
        }
        return task;
      });
      
      setTasks(updatedTasks);
      toast({
        title: 'Tasks Prioritized!',
        description: 'Your tasks have been intelligently sorted by priority.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'AI Prioritization Failed',
        description: 'Could not prioritize tasks. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task =>
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      if (!a.completed) {
        if (a.priority !== null && b.priority !== null) {
          if(a.priority !== b.priority) return a.priority - b.priority;
        }
        if (a.priority !== null && b.priority === null) return -1;
        if (a.priority === null && b.priority !== null) return 1;
      }
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
  }, [filteredTasks]);

  return (
    <>
      <div className="min-h-screen bg-background text-foreground font-body">
        <AppHeader />
        <main className="container mx-auto max-w-3xl px-4 pb-16">
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <TaskForm onAddTask={handleAddTask} />
              </CardContent>
            </Card>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <AIPrioritizer onPrioritize={handlePrioritizeTasks} isLoading={isAiLoading} hasTasks={tasks.some(t => !t.completed)} />
            </div>
            <TaskList
              tasks={sortedTasks}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
              onSetFocus={handleSetFocus}
            />
          </div>
        </main>
      </div>
      {focusedTask && <FocusView task={focusedTask} onExit={() => handleSetFocus(null)} />}
    </>
  );
}
