<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import RichEditor from './Rte.svelte';
  import { getNotes, updateNote } from '$lib/note-data.svelte';
  import { page } from '$app/state';
  import { get } from 'svelte/store';

  let key = $state(page.params.noteid);
  let note = $derived(getNotes().find(n => n._id === key));

  $effect(() => {
    if (page.params.noteid) {
      key = page.params.noteid;
    }
  });

  function handleUpdate() {
    if (note) {
      updateNote(note._id, { title: note.title, content: note.content });
    }
  }
</script>

{#key key}
  {#if note}
    <div class="flex flex-col items-center overflow-y-auto no-scrollbar h-full w-full">
      <div class="flex flex-row justify-center w-full pt-8">
        <input
          oninput={handleUpdate}
          type="text"
          bind:value={note.title}
          class="text-white field-sizing-content outline-none text-3xl font-bold px-2 border-none ring-offset-0 ring-0"
        />
      </div>
      <div class="w-2/3">
        <RichEditor
          noteContent={note.content}
          noteId={note._id}
        />
      </div>
    </div>
  {:else}
    <div class="w-full h-full flex items-center justify-center">Loading...</div>
  {/if}
{/key}
