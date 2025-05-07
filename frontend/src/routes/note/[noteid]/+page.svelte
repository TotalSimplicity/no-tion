<script lang="ts">
    import { onMount } from 'svelte';
    import { notes, updateNote } from '$lib/note-data';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';

    let note = $derived(get(notes).find((n) => n._id === key));
    let key = $state();

    $effect(() => {
        key = $page.params.noteid;
    });


    function handleUpdate() {
        if (note) {
            updateNote(note._id, { title: note.title, content: note.content });
        }
    }
</script>

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
    />
{:else}
    <p>Loading...</p>
{/if}
