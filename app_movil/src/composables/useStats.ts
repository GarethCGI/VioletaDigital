import { ref } from 'vue';
import { fetch } from '@tauri-apps/plugin-http';
import { useAuthStore } from '@/stores/auth';

const API_BASE_URL = 'http://violetadigital.ddns.our-space.xyz:3000';

export type StatsPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export function useStats() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const data = ref<any | null>(null);
  const auth = useAuthStore();

  const fetchStats = async (period: StatsPeriod = 'daily') => {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports/stats?period=${period}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const json = await res.json();
      data.value = json.data ?? json;
      return data.value;
    } catch (err) {
      console.error('Error fetching stats:', err);
      error.value = err instanceof Error ? err.message : 'Error al obtener estadísticas';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, data, fetchStats };
}
