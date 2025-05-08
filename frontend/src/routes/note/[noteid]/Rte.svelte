<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import { Markdown } from 'tiptap-markdown';
  import { updateNote } from '$lib/note-data.svelte';

  // Props passed into the component

  let { noteContent, noteId } = $props();

  let editor;
  let editorEl;

  // Create editor instance when component mounts
  onMount(() => {
    editor = new Editor({
      element: editorEl,
      content: noteContent,
      extensions: [StarterKit, Markdown],
      onTransaction: () => {
        // Force Svelte's reactivity system to recognize the change
        editor = editor;
      },
    });

    // Bind the editor to the DOM element
    editor.setOptions({ element: editorEl });

    // Register the update event listener
    editor.on('update', ({ editor }) => {
      const htmlContent = editor.getHTML();
      console.log('Updated content:', htmlContent);
      updateNote(noteId, { content: htmlContent });
    });
  });

  // Clean up the editor when the component is destroyed
  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>

<style global>
    
</style>

<div
  bind:this={editorEl}
  class="p-4 bg-black"
></div>
