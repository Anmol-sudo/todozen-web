import { ListTodo } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-8">
      <div className="container mx-auto flex max-w-3xl items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-3">
          <ListTodo className="size-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-headline">
            TodoZen
          </h1>
        </div>
      </div>
    </header>
  );
}
