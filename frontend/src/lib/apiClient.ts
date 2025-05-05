import axios from 'axios';

console.log('API Server URL:', import.meta.env.VITE_API_SERVER);

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_SERVER || "http://localhost:3001",
	headers: {
		'Content-Type': 'application/json'
	}
});

apiClient.interceptors.request.use(
	(config: import('axios').InternalAxiosRequestConfig) => {
		const token: string | null = localStorage.getItem('authToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: any) => {
		return Promise.reject(error);
	}
);

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			console.error('Unauthorized access - redirecting to login');
			localStorage.removeItem('authToken');
			if (typeof window !== 'undefined' && window.location.pathname != '/login') {
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	}
);

export default apiClient;
