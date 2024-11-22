<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { ListTodo, CheckCircle2, PlusCircle } from "lucide-svelte";
  import TodoItem from "./TodoItem.svelte";

  const todos = writable([]);
  let newTodo = "";
  let unsubscribe;

  onMount(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      todos.set(JSON.parse(saved));
    }

    unsubscribe = todos.subscribe(value => {
      localStorage.setItem("todos", JSON.stringify(value));
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  });

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      todos.update(current => [
        {
          id: crypto.randomUUID(),
          text: newTodo.trim(),
          completed: false,
        },
        ...current,
      ]);
      newTodo = "";
    }
  };

  const toggleTodo = (id) => {
    todos.update(current =>
      current.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    todos.update(current => current.filter(todo => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    todos.update(current =>
      current.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  let completedCount = 0;
  todos.subscribe(value => {
    completedCount = value.filter(todo => todo.completed).length;
  });
</script>

<div class="bg-white rounded-xl shadow-lg p-6 mb-8">
  <div class="flex items-center gap-3 mb-6">
    <ListTodo class="w-8 h-8 text-emerald-500" />
    <h1 class="text-2xl font-bold text-gray-800">My Todo List</h1>
  </div>

  <form on:submit={addTodo} class="flex gap-2 mb-8">
    <input
      type="text"
      bind:value={newTodo}
      placeholder="Add a new task..."
      class="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
    />
    <button
      type="submit"
      class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200 flex items-center gap-2"
    >
      <PlusCircle class="w-5 h-5" />
      Add Task
    </button>
  </form>

  <div class="flex items-center justify-between mb-6">
    <div class="text-sm text-gray-500">
      {$todos.length} total tasks, {completedCount} completed
    </div>
    {#if completedCount > 0}
      <div class="flex items-center gap-2 text-emerald-500">
        <CheckCircle2 class="w-5 h-5" />
        <span class="text-sm font-medium">
          {Math.round((completedCount / $todos.length) * 100)}% done
        </span>
      </div>
    {/if}
  </div>

  <div class="space-y-3">
    {#each $todos as todo}
      <TodoItem
        {todo}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo}
      />
    {/each}
    {#if $todos.length === 0}
      <div class="text-center py-8 text-gray-500">
        No tasks yet. Add one above!
      </div>
    {/if}
  </div>
</div>