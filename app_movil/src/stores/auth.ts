import { defineStore } from 'pinia';
import { fetch } from '@tauri-apps/plugin-http';

export const API_BASE_URL = 'http://violetadigital.ddns.our-space.xyz:19132';

interface UserInfo {
	username: string;
}

interface AuthState {
	accessToken: string | null;
	refreshToken: string | null;
	user: UserInfo | null;
}

export const useAuthStore = defineStore('auth', {
	state: (): AuthState => ({
		accessToken: null,
		refreshToken: null,
		user: null,
	}),
	getters: {
		isAuthenticated: (s) => !!s.accessToken,
		authHeader: (s) => (s.accessToken ? { Authorization: `Bearer ${s.accessToken}` } : {}),
	},
	actions: {
		async login(username: string, password: string) {
			const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});
			console.debug(res)
			if (!res.ok) throw new Error('Error de autenticación');
			const json = await res.json() as { success: boolean; data?: { accessToken: string; refreshToken: string }; error?: string };
			if (!json.success || !json.data) throw new Error(json.error || 'Credenciales inválidas');
			this.accessToken = json.data.accessToken;
			this.refreshToken = json.data.refreshToken;
			this.user = { username };
		},
		async refresh() {
			if (!this.refreshToken) throw new Error('No refresh token');
			const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refreshToken: this.refreshToken }),
			});
			if (!res.ok) throw new Error('No autorizado');
			const json = await res.json() as { success: boolean; data?: { accessToken: string; refreshToken: string } };
			if (!json.success || !json.data) throw new Error('No autorizado');
			this.accessToken = json.data.accessToken;
			this.refreshToken = json.data.refreshToken;
		},
		async logout() {
			try {
				if (this.refreshToken) {
					await fetch(`${API_BASE_URL}/api/auth/logout`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ refreshToken: this.refreshToken }),
					});
				}
			} finally {
				this.accessToken = null;
				this.refreshToken = null;
				this.user = null;
			}
		},
	},
	tauri: {
		autoStart: true
	}
});
