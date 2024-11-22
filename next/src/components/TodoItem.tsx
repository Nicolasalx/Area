'use client';

import React from 'react';
import { Check, Trash2, Edit2 } from 'lucide-react';
import { type Todo } from '@/types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(todo.text);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editText.trim()) {
      onEdit(todo.id, editText);
      setIsEditing(false);
    }
  };

  return (
    <div className="group flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md todo-item">
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-colors duration-200 flex items-center justify-center
          ${todo.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-emerald-500'}`}
      >
        {todo.completed && <Check className="w-4 h-4 text-white" />}
      </button>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full px-2 py-1 border-b-2 border-emerald-500 focus:outline-none"
            autoFocus
            onBlur={handleSubmit}
          />
        </form>
      ) : (
        <span className={`flex-1 ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
          {todo.text}
        </span>
      )}

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-gray-400 hover:text-emerald-500 transition-colors duration-200"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}