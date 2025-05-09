<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Tipex, type TipexEditor } from '@friendofsvelte/tipex';
  import { updateNote } from '$lib/note-data.svelte';

  let { noteContent, noteId } = $props();
  let editor: TipexEditor = $state();

  const commands = [
    { title: 'Heading 1', keyword: 'heading' },
    { title: 'Bullet List', keyword: 'unordered' },
    { title: 'Numbered List', keyword: 'ordered' },
  ];

  let filteredCommands = $state([]);
  let commandQuery = $state('');
  let menuPosition = $state({ top: 0, left: 0 });

  async function onupdate() {
    updateNoteContent();
    checkSlashCommand();
  }

  async function updateNoteContent() {
    if (editor) {
      updateNote(noteId, { content: editor.getHTML() });
    }
  }

  function checkSlashCommand() {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) return;

    const text = sel.anchorNode.textContent?.slice(0, sel.anchorOffset) || '';
    const match = text.match(/\/(\w*)$/);

    if (match) {
      console.info('Match found:', match[1]);
      commandQuery = match[1];
      filteredCommands = commands.filter((cmd) =>
        cmd.keyword.startsWith(match[1])
      );

      console.log('Filtered commands:', filteredCommands);

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (rect && rect.top !== 0 && rect.left !== 0) {
        const menuHeight = filteredCommands.length * 40;
        menuPosition = {
          top: rect.top + window.scrollY - menuHeight - 10,
          left: rect.left + window.scrollX,
        };
      } else {
        menuPosition = {
          top: window.scrollY + 100,
          left: window.scrollX + 100,
        };
      }
    } else {
      filteredCommands = [];
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab')
      event.preventDefault();
    if (event.key === 'Tab' && filteredCommands.length > 0) {

      // Autofill the top command
      const topCommand = filteredCommands[0];
      if (topCommand) {
        const sel = window.getSelection();
        if (sel && sel.anchorNode) {
          const text = sel.anchorNode.textContent || '';
          const newText = text.replace(/\/\w*$/, `/${topCommand.keyword} `);
          sel.anchorNode.textContent = newText;

          const range = document.createRange();
          range.setStart(sel.anchorNode, newText.length);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);

          filteredCommands = [];
        }
      }
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    document.removeEventListener('keydown', handleKeydown);
  });
</script>


<Tipex body={noteContent} bind:tipex={editor} {onupdate} />

{#if filteredCommands.length > 0}
  <div class="fixed flex flex-col gap-2 bg-secondary text-black text-xl" style="top: {menuPosition.top}px; left: {menuPosition.left}px;">
  {#each filteredCommands as command}
    <div class="p-2 bg-primary text-white rounded-md">
      {command.title}
    </div>
  {/each}
</div>
{/if}

