<script lang="ts">
	import { onMount } from 'svelte';
    import { notes } from '$lib/note-data';
	import apiClient from '$lib/apiClient';
	import { page } from '$app/stores';

	let note = $state({});
	let key = $state($page.params.noteid);

	$effect(() => {
		key = $page.params.noteid;
		fetchNote();
	});

	async function fetchNote() {
		const response = await apiClient.get(`/note/${$page.params.noteid}`);
		note = response.data;
	}

	async function updateNote() {
		if (note && note.title !== undefined) {
			await apiClient.patch(`/note/${$page.params.noteid}`, note);
		}
	}
</script>

{#key key}
	<input oninput={updateNote} type="text" bind:value={note.title} class="text-white" />
	<textarea
		class="bg-black text-white w-full h-[50svh] border-2 border-gray-800 rounded-md p-2"
		bind:value={note.content}
		oninput={updateNote}
	/>
{/key}
