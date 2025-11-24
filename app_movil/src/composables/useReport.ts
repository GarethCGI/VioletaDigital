import { ref } from 'vue';
import { fetch } from '@tauri-apps/plugin-http';
import type { CreateReportDTO, Report, ApiResponse } from '@/types/report';
import { API_BASE_URL, useAuthStore } from '@/stores/auth';

// API base URL - can be configured via environment variable

export function useReport() {
	const loading = ref(false);
	const error = ref<string | null>(null);
  const auth = useAuthStore();

	const submitReport = async (data: CreateReportDTO): Promise<boolean> => {
		loading.value = true;
		error.value = null;

		try {
			const response = await fetch(`${API_BASE_URL}/api/reports`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json() as ApiResponse<never>;
				throw new Error(errorData.error || `Error: ${response.status}`);
			}

			const result = await response.json() as ApiResponse<Report>;

			if (!result.success) {
				throw new Error(result.error || 'Error al enviar el reporte');
			}

			return true;
		} catch (err) {
			console.error('Error submitting report:', err);
			error.value = err instanceof Error ? err.message : 'Error al enviar el reporte';
			return false;
		} finally {
			loading.value = false;
		}
	};

	const getReports = async (page = 1, limit = 10) => {
		loading.value = true;
		error.value = null;

		try {
			const response = await fetch(
				`${API_BASE_URL}/api/reports?page=${page}&limit=${limit}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
					},
				}
			);

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			const result = await response.json();
			return result;
		} catch (err) {
			console.error('Error fetching reports:', err);
			error.value = err instanceof Error ? err.message : 'Error al obtener reportes';
			return null;
		} finally {
			loading.value = false;
		}
	};

	const getReportById = async (id: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await fetch(`${API_BASE_URL}/api/reports/${id}` , {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
				},
			});
			if (!response.ok) throw new Error(`Error: ${response.status}`);
			return await response.json();
		} catch (err) {
			console.error('Error fetching report:', err);
			error.value = err instanceof Error ? err.message : 'Error al obtener reporte';
			return null;
		} finally {
			loading.value = false;
		}
	};

	return {
		loading,
		error,
		submitReport,
		getReports,
		getReportById,
	};
}
