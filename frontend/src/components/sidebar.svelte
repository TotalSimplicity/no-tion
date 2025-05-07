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

<div class="bg-black w-64 md:flex flex-col items-center hidden text-white border-r-2 border-gray-800 h-svh text-3xl select-none">
    <a href="/">No-tion</a>
    <div class="flex flex-col w-full mx-1 mt-20 gap-2 h-[50svh] overflow-y-auto no-scrollbar">
        {#each getNotes().filter(note => note.parent === null) as note}
            <NoteIcon noteId={note._id} parentFetchChildren={fetchNotes} />
        {/each}
    </div>
    
</div>