'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Clock } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';

const formSchema = z.object({
  description: z.string().min(1, { message: 'Task description is required.' }),
  dueDate: z.date().optional(),
  dueTime: z.string().regex(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time format (HH:mm)"}).optional(),
});

type TaskFormProps = {
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'priority' | 'reason'>) => void;
};

const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2).toString().padStart(2, '0');
    const minutes = (i % 2 === 0 ? '00' : '30');
    return `${hours}:${minutes}`;
});


export function TaskForm({ onAddTask }: TaskFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      dueTime: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let combinedDueDate: Date | null = values.dueDate ?? null;

    if (values.dueDate && values.dueTime) {
        const [hours, minutes] = values.dueTime.split(':').map(Number);
        const newDate = new Date(values.dueDate);
        newDate.setHours(hours, minutes, 0, 0);
        combinedDueDate = newDate;
    }
    
    onAddTask({ description: values.description, dueDate: combinedDueDate, dueTime: values.dueTime ?? null });
    
    // Show a notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Task Added!', {
        body: values.description,
      });
    }
    
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start gap-2">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-grow w-full">
              <FormControl>
                <Input placeholder="What needs to be done?" {...field} />
              </FormControl>
              <FormMessage className="sm:hidden" />
            </FormItem>
          )}
        />

        <div className="w-full sm:w-auto flex gap-2">
            <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
                <FormItem className="flex-grow">
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={'outline'}
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                            format(field.value, 'PPP')
                        ) : (
                            <span>Pick a date</span>
                        )}
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        initialFocus
                        captionLayout="dropdown-nav"
                        fromYear={new Date().getFullYear()}
                        toYear={new Date().getFullYear() + 10}
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <FormField
              control={form.control}
              name="dueTime"
              render={({ field }) => (
                <FormItem className="w-[120px]">
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!form.watch('dueDate')}>
                    <FormControl>
                      <SelectTrigger>
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <div className="pl-4">
                            <SelectValue placeholder="HH:mm" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <ScrollArea className="h-72">
                            {timeOptions.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                        </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage className="sm:hidden" />
                </FormItem>
              )}
            />

            <Button type="submit" size="icon" className="shrink-0">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Task</span>
            </Button>
        </div>
        <FormField
          control={form.control}
          name="description"
          render={() => (
            <FormItem>
              <FormMessage className="hidden sm:block" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueTime"
          render={() => (
            <FormItem>
              <FormMessage className="hidden sm:block" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
