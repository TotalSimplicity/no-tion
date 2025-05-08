<script lang="ts">
    import { page } from '$app/state';
    import { getNotes, fetchNotes } from '$lib/note-data.svelte';
    import apiClient from '$lib/apiClient';
    import NoteIcon from './noteicon.svelte';
    import { onMount } from 'svelte';
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    
    onMount(async () => {
        fetchNotes();
    });
</script>

<div class="bg-secondary px-2 w-64 md:flex flex-col items-center hidden text-white border-r-1 border-accent h-svh text-3xl select-none">
    <a class="pt-8" href="/">No-tion</a>
    <div class="flex flex-col w-full mx-1 mt-20 gap-2 h-[50svh] overflow-y-auto no-scrollbar">
        {#each getNotes().filter(note => note.parent === null) as note}
            <NoteIcon noteId={note._id} parentFetchChildren={fetchNotes} />
        {/each}
    </div>
    
</div>