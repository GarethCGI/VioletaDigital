import { ref } from 'vue';
import { fetch } from '@tauri-apps/plugin-http';
import type {
	CreateReportDTO,
	Report,
	ApiResponse,
	QuestionnaireRiskLevel,
	QuestionnaireInformantRole,
} from '@/types/report';
import { API_BASE_URL, useAuthStore } from '@/stores/auth';

// API base URL - can be configured via environment variable

function getReadableNetworkError(err: unknown, fallback: string): string {
	if (!(err instanceof Error)) return fallback;

	const msg = err.message.toLowerCase();
	if (
		msg.includes('error sending request') ||
		msg.includes('failed to fetch') ||
		msg.includes('no route to host') ||
		msg.includes('connection refused') ||
		msg.includes('timed out')
	) {
		return `No se pudo conectar con el servidor (${API_BASE_URL}). Verifica internet o que la API esté activa.`;
	}

	return err.message || fallback;
}

export function useReport() {
	const loading = ref(false);
	const error = ref<string | null>(null);
  const auth = useAuthStore();

	type ReportListFilters = {
		role?: string;
		type?: string;
		informantRole?: QuestionnaireInformantRole;
		riskLevel?: QuestionnaireRiskLevel;
		hasQuestionnaire?: boolean;
	};

	const submitReport = async (data: CreateReportDTO): Promise<boolean> => {
		loading.value = true;
		error.value = null;

		try {
			console.log('[submitReport] Submitting data:', JSON.stringify(data, null, 2));
			
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
			console.log('[submitReport] Response:', JSON.stringify(result, null, 2));

			if (!result.success) {
				throw new Error(result.error || 'Error al enviar el reporte');
			}

			// Detect server/client schema drift: questionnaire was sent but not persisted.
			if (data.questionnaireData) {
				const persisted = result.data?.hasQuestionnaire === true || Boolean(result.data?.questionnaireData);
				if (!persisted) {
					throw new Error(
						'La API recibió el reporte, pero no guardó el cuestionario. Revisa que el backend desplegado tenga la versión con questionnaireData/riskLevel/hasQuestionnaire.'
					);
				}
			}

			return true;
		} catch (err) {
			console.error('[submitReport] Error submitting report:', err);
			error.value = getReadableNetworkError(err, 'Error al enviar el reporte');
			return false;
		} finally {
			loading.value = false;
		}
	};

	const getReports = async (page = 1, limit = 10, filters: ReportListFilters = {}) => {
		loading.value = true;
		error.value = null;

		try {
			const query = new URLSearchParams({
				page: String(page),
				limit: String(limit),
			});

			if (filters.role) query.set('role', filters.role);
			if (filters.type) query.set('type', filters.type);
			if (filters.informantRole) query.set('informantRole', filters.informantRole);
			if (filters.riskLevel) query.set('riskLevel', filters.riskLevel);
			if (typeof filters.hasQuestionnaire === 'boolean') {
				query.set('hasQuestionnaire', String(filters.hasQuestionnaire));
			}

			console.log('[useReport.getReports] Fetching reports with query:', query.toString());

			const response = await fetch(
				`${API_BASE_URL}/api/reports?${query.toString()}`,
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
			console.log('[useReport.getReports] Response:', JSON.stringify(result, null, 2));
			return result;
		} catch (err) {
			console.error('[useReport.getReports] Error fetching reports:', err);
			error.value = getReadableNetworkError(err, 'Error al obtener reportes');
			return null;
		} finally {
			loading.value = false;
		}
	};

	const getReportById = async (id: string) => {
		loading.value = true;
		error.value = null;
		try {
			console.log('[useReport.getReportById] Fetching report with ID:', id);
			
			const response = await fetch(`${API_BASE_URL}/api/reports/${id}` , {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
				},
			});
			if (!response.ok) throw new Error(`Error: ${response.status}`);
			
			const result = await response.json();
			console.log('[useReport.getReportById] Response:', JSON.stringify(result, null, 2));
			return result;
		} catch (err) {
			console.error('[useReport.getReportById] Error fetching report:', err);
			error.value = getReadableNetworkError(err, 'Error al obtener reporte');
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
