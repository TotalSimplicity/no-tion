import apiClient from './apiClient';
import { goto } from '$app/navigation';

let notes = $state([])

type Note = {
    _id: string;
    title: string;
    tags: string[];
    content: string;
    createdAt: string;
    updatedAt: string;
};

export function getNotes() {
	return notes;
}

export async function fetchNotes() {
	try {
		const response = await apiClient.get('/note');
		notes = response.data;
	} catch (error) {
		console.error('Failed to fetch notes:', error);
	}
}

export async function addNote(newNote: Note) {
	try {
		const response = await apiClient.post('/note', newNote);
		notes = [...notes, response.data];
		goto('/note/' + response.data._id);
	} catch (error) {
		console.error('Failed to add note:', error);
	}
}


export async function updateNote(noteId: string, updatedFields: Partial<Note>) {
	try {
		const response = await apiClient.patch(`/note/${noteId}`, updatedFields);
		notes = notes.map((note) => (note._id === noteId ? response.data : note)); // Update the reactive variable
	} catch (error) {
		console.error('Failed to update note:', error);
	}
}


export async function deleteNote(noteId: string) {
    try {
        await apiClient.delete(`/note/${noteId}`);
        const currentNote = notes.find((note) => note._id === noteId);
        if (currentNote) {
            goto('/'); // Navigate away if the deleted note is currently viewed
        }
        notes = notes.filter((note) => note._id !== noteId); // Update the reactive variable
    } catch (error) {
        console.error('Failed to delete note:', error);
    }
}
