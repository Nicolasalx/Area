import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle2, ListTodo } from 'lucide-react';
import { TodoItem } from './components/TodoItem';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([
        {
          id: crypto.randomUUID(),
          text: newTodo.trim(),
          completed: false,
        },
        ...todos,
      ]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id: string, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <ListTodo className="w-8 h-8 text-emerald-500" />
            <h1 className="text-2xl font-bold text-gray-800">My Todo List</h1>
          </div>

          <form onSubmit={addTodo} className="flex gap-2 mb-8">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200 flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Add Task
            </button>
          </form>

          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-500">
              {todos.length} total tasks, {completedCount} completed
            </div>
            {completedCount > 0 && (
              <div className="flex items-center gap-2 text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {Math.round((completedCount / todos.length) * 100)}% done
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
            {todos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No tasks yet. Add one above!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;