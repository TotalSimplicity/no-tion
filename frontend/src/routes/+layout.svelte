<script lang="ts">
	import { page } from '$app/state';
	import '../app.css';
	import Sidebar from '../components/sidebar.svelte';
	let { children } = $props();
	import { verifyToken } from "$lib/auth";
	import { onMount } from "svelte";
	
    onMount(() => {
        verifyToken();
    });
</script>

<div class="flex md:flex-row flex-col h-svh w-full">
{#if page.url.pathname !== '/login'}
<Sidebar />
{/if}
<div class="w-full md:h-svh h-full overflow-y-scroll overflow-x-clip bg-black text-white">
{@render children()}
</div>
</div>