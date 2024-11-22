<script>
  import { Check, Trash2, Edit2 } from 'lucide-svelte';
  import { onMount } from 'svelte';

  export let todo;
  export let onToggle;
  export let onDelete;
  export let onEdit;

  let isEditing = false;
  let editText = todo.text;

  function handleSubmit(event) {
    event.preventDefault();
    if (editText.trim()) {
      onEdit(todo.id, editText);
      isEditing = false;
    }
  }
</script>

<div class="group flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md todo-item">
  <button
    on:click={() => onToggle(todo.id)}
    class={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-colors duration-200 flex items-center justify-center ${todo.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-emerald-500'}`}
  >
    {#if todo.completed}
      <Check class="w-4 h-4 text-white" />
    {/if}
  </button>

  {#if isEditing}
    <form on:submit={handleSubmit} class="flex-1">
      <input
        type="text"
        bind:value={editText}
        class="w-full px-2 py-1 border-b-2 border-emerald-500 focus:outline-none"
        autoFocus
        on:blur={handleSubmit}
      />
    </form>
  {:else}
    <span class={`flex-1 ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
      {todo.text}
    </span>
  {/if}

  <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
    <button
      on:click={() => isEditing = true}
      class="p-1 text-gray-400 hover:text-emerald-500 transition-colors duration-200"
    >
      <Edit2 class="w-4 h-4" />
    </button>
    <button
      on:click={() => onDelete(todo.id)}
      class="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
    >
      <Trash2 class="w-4 h-4" />
    </button>
  </div>
</div>