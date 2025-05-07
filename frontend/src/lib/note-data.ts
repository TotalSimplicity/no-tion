import { writable } from 'svelte/store';
import apiClient from './apiClient';
import { goto } from '$app/navigation';
import type { Writable } from 'svelte/store';

export const notes: Writable<Note[]> = writable([]);

type Note = {
    _id: string;
    title: string;
    tags: string[];
    content: string;
    createdAt: string;
    updatedAt: string;
};

export async function fetchNotes() {
	try {
		const response = await apiClient.get('/note');
		notes.set(response.data);
	} catch (error) {
		console.error('Failed to fetch notes:', error);
	}
}

export async function addNote(newNote: Note) {
	try {
		const response = await apiClient.post('/note', newNote);
		notes.update((currentNotes: Note[]) => {
			const updatedNotes = [...currentNotes, response.data];
			console.log('Note added:', response.data);
			console.log('Current notes:', updatedNotes);
			return updatedNotes;
		});
        goto('/note/' + response.data._id);
	} catch (error) {
		console.error('Failed to add note:', error);
	}
}

export async function updateNote(noteId: string, updatedFields: Partial<Note>) {
	try {
		const response = await apiClient.patch(`/note/${noteId}`, updatedFields);
		notes.update((currentNotes) =>
			currentNotes.map((note) => (note._id === noteId ? response.data : note))
		);
	} catch (error) {
		console.error('Failed to update note:', error);
	}
}

export async function deleteNote(noteId: string) {
	try {
		await apiClient.delete(`/note/${noteId}`);
		notes.update((currentNotes) => {
			const updatedNotes = currentNotes.filter((note) => note._id !== noteId);

			const currentNote = currentNotes.find((note) => note._id === noteId);
			if (currentNote) {
				goto('/'); 
			}

			return updatedNotes;
		});
	} catch (error) {
		console.error('Failed to delete note:', error);
	}
}