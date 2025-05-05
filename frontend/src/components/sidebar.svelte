<script>
    import { page } from '$app/state';
    import apiClient from '$lib/apiClient';
    import { onMount } from 'svelte';
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    let notes = $state([]);
    onMount(async () => {
        const notes = await apiClient.get('/note')
        console.log(notes);
    });
</script>

<div class="bg-black w-64 md:flex flex-col items-center hidden text-white border-r-2 border-gray-800 h-screen text-3xl">
    <h1>No-tion</h1>
</div>