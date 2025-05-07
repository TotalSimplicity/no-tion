<script lang="ts">
    import { onMount } from 'svelte';
    import { getNotes, updateNote } from '$lib/note-data.svelte';
    import { page } from '$app/state';
    import { get } from 'svelte/store';

    
    let key = $state(page.params.noteid);
    let note = $derived(getNotes().find(n => n._id === key));
    onMount(() => {
        if (!getNotes()) {
            // Handle the case where the note is not found
            console.error('Note not found');
        }
    });

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
    <input
        oninput={handleUpdate}
        type="text"
        bind:value={note.title}
        class="text-white"
    />
    <textarea
        class="bg-black text-white w-full h-[50svh] border-2 border-gray-800 rounded-md p-2"
        bind:value={note.content}
        oninput={handleUpdate}
    ></textarea>
{:else}
    <p>Loading...</p>
{/if}
{/key}