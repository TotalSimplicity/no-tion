import apiClient from './apiClient';
import { goto } from '$app/navigation';

export async function login(username: string, password: string) {
	try {
		const response = await apiClient.post('/user/login', { username, password });
		localStorage.setItem('authToken', response.data.token);
		goto('/');
	} catch {
		throw new Error('Invalid username or password');
	}
}

export async function verifyToken() {
	try {
		await apiClient.get('/user/verify-token');
		if (location.pathname === '/login') goto('/');
	} catch {
		goto('/login');
	}
}
