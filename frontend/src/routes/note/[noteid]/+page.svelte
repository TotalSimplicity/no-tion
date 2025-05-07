<script lang="ts">
    import { onMount } from 'svelte';
    import { notes, updateNote } from '$lib/note-data';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import { derived, writable } from 'svelte/store';

    
    let key = $state($page.params.noteid);
    let note = writable(derived(notes, $notes => $notes.find(n => n._id === key)));
    let localNote = $note;
    onMount(() => {
        if (!$note) {
            // Handle the case where the note is not found
            console.error('Note not found');
        }
        console.log("key", key);
        console.log("note", get($note));
        console.log("notes", $notes);
    });

    $effect(() => {
        if (key) {
            console.log("key", key);
        }
    });


    function handleUpdate() {
        if ($note) {
            updateNote($note._id, { title: localNote.title, content: localNote.content });
        }
    }
</script>

{#if $note}
    <input
        oninput={handleUpdate}
        type="text"
        bind:value={$note.title}
        class="text-white"
    />
    <textarea
        class="bg-black text-white w-full h-[50svh] border-2 border-gray-800 rounded-md p-2"
        bind:value={$note.content}
        oninput={handleUpdate}
    />
{:else}
    <p>Loading...</p>
{/if}
