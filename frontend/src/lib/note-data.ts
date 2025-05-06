import { writable } from 'svelte/store';
import apiClient from './apiClient';


export const notes = writable([]);

export async function fetchNotes() {
	try {
		const response = await apiClient.get('/note');
		notes.set(response.data);
	} catch (error) {
		console.error('Failed to fetch notes:', error);
	}
}

export async function addNote(newNote) {
	try {
		const response = await apiClient.post('/note', newNote);
		notes.update((currentNotes) => [...currentNotes, response.data]);
	} catch (error) {
		console.error('Failed to add note:', error);
	}
}

export async function updateNote(noteId, updatedFields) {
	try {
		const response = await apiClient.patch(`/note/${noteId}`, updatedFields);
		notes.update((currentNotes) =>
			currentNotes.map((note) => (note._id === noteId ? response.data : note))
		);
	} catch (error) {
		console.error('Failed to update note:', error);
	}
}

export async function deleteNote(noteId) {
	try {
		await apiClient.delete(`/note/${noteId}`);
		notes.update((currentNotes) => currentNotes.filter((note) => note._id !== noteId));
	} catch (error) {
		console.error('Failed to delete note:', error);
	}
}