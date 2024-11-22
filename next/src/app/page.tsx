'use client';

import { TodoList } from '@/components/TodoList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <TodoList />
      </div>
    </div>
  );
}