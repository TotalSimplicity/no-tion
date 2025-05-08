<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import { Markdown } from 'tiptap-markdown';
  import { updateNote } from '$lib/note-data.svelte';
  import { Slash, enableKeyboardNavigation } from "@harshtalks/slash-tiptap";
  import { suggestions } from '$lib/suggestions';



  let { noteContent, noteId } = $props();

  let editor;
  let editorEl;

  onMount(() => {
    editor = new Editor({
      element: editorEl,
      content: noteContent,
      extensions: [StarterKit, Markdown],
    });

    editor.setOptions({ element: editorEl });

    editor.on('update', ({ editor }) => {
      const htmlContent = editor.getHTML();
      console.log('Updated content:', htmlContent);
      updateNote(noteId, { content: htmlContent });
    });
  });

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
  class="p-4 bg-main w-full"
></div>
