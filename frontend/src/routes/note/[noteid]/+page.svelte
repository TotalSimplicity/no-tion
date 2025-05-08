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
    <!-- Input for title -->
    <input
      oninput={handleUpdate}
      type="text"
      bind:value={note.title}
      class="text-white w-full bg-black border-b-2 border-gray-800 p-2"
    />

    <!-- Using the TiptapEditor for content editing -->
    <RichEditor
      noteContent={note.content}
      noteId={note._id}
    />
  {:else}
    <div class="w-full h-full flex items-center justify-center">Loading...</div>
  {/if}
{/key}
