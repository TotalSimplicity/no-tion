<script>
    import { page } from '$app/state';
    import apiClient from '$lib/apiClient';
    import NoteIcon from './noteicon.svelte';
    import { onMount } from 'svelte';
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    let notes = $state([]);

    async function fetchNotes() {
        const response = await apiClient.get('/note');
        notes = response.data;
    }
    onMount(async () => {
        fetchNotes();
    });
</script>

<div class="bg-black w-64 md:flex flex-col items-center hidden text-white border-r-2 border-gray-800 h-svh text-3xl select-none">
    <h1>No-tion</h1>
    <div class="flex flex-col w-full mx-1 mt-20 gap-2 h-[50svh] overflow-y-auto no-scrollbar">
        {#each notes.filter(note => note.parent === null) as note}
            <NoteIcon note={note} parentFetchChildren />
        {/each}
    </div>
    
</div>