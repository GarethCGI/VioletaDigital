<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStats, type StatsPeriod } from '@/composables/useStats';
import { Icon } from '@iconify/vue';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { useAuthStore } from '@/stores/auth';
import { Line, Doughnut, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

const periods: StatsPeriod[] = ['daily', 'weekly', 'monthly', 'yearly'];
const active = ref<StatsPeriod>('daily');
const { error, data, fetchStats } = useStats();
const auth = useAuthStore();

onMounted(() => {
  fetchStats(active.value);
});

async function changePeriod(p: StatsPeriod) {
  active.value = p;
  await fetchStats(p);
}

const colors = {
  primary: '#4f46e5',
  primarySoft: 'rgba(79,70,229,0.2)',
  red: '#ef4444',
  amber: '#f59e0b',
  purple: '#8b5cf6',
  teal: '#14b8a6',
  sky: '#0ea5e9',
  indigo: '#6366f1',
  pink: '#ec4899',
  slate: '#64748b',
};

function series() {
  const ts = data.value?.timeSeries || [];
  return {
    labels: ts.map((x: any) => x.bucket),
    datasets: [
      {
        label: 'Reportes',
        data: ts.map((x: any) => x.count),
        borderColor: colors.primary,
        backgroundColor: colors.primarySoft,
        tension: 0.3,
        fill: true,
      },
    ],
  };
}

function pieType() {
  const ds = data.value?.typeDistribution || [];
  const labels = ds.map((x: any) => x.type);
  const counts = ds.map((x: any) => x.count);
  return {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: [colors.red, colors.amber, colors.purple],
      },
    ],
  };
}

function barRole() {
  const ds = data.value?.roleDistribution || [];
  const labels = ds.map((x: any) => x.role);
  const counts = ds.map((x: any) => x.count);
  return {
    labels,
    datasets: [
      {
        label: 'Reportes',
        data: counts,
        backgroundColor: [colors.teal, colors.sky, colors.indigo, colors.pink, colors.slate],
      },
    ],
  };
}

</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-8 h-screen flex flex-col">
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-sm text-muted-foreground">Panel de administración</p>
        <h2 class="text-2xl font-semibold" style="font-family: 'Kaushan Script', cursive;">Estadísticas</h2>
      </div>
      <Button variant="outline" @click="auth.logout()">Cerrar sesión</Button>
    </div>

    <div class="mb-4 flex gap-2">
      <button
        v-for="p in periods"
        :key="p"
        :class="['px-3 py-1 rounded-md border text-sm', p === active ? 'bg-primary text-white border-primary' : 'bg-transparent']"
        @click="changePeriod(p)"
      >
        {{ p }}
      </button>
    </div>

    <div v-if="error" class="mb-4 rounded-md border-2 border-destructive bg-destructive/10 p-2 text-sm flex items-center gap-2">
      <Icon icon="mdi:alert" class="size-4 text-destructive" />
      <span>{{ error }}</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="rounded-lg border bg-card text-card-foreground p-4">
        <p class="text-xs text-muted-foreground">Total de reportes</p>
        <p class="text-2xl font-semibold">{{ data?.total ?? 0 }}</p>
      </div>
      <div class="rounded-lg border bg-card text-card-foreground p-4">
        <p class="text-xs text-muted-foreground">Período activo</p>
        <p class="text-2xl font-semibold capitalize">{{ active }}</p>
      </div>
      <div class="rounded-lg border bg-card text-card-foreground p-4">
        <p class="text-xs text-muted-foreground">Última actualización</p>
        <p class="text-2xl font-semibold">{{ new Date().toLocaleString() }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
      <div class="rounded-lg border bg-card text-card-foreground p-4 flex flex-col">
        <h3 class="text-sm font-medium mb-2">Tendencia de reportes</h3>
        <div class="flex-grow">
          <Line :data="series()" :options="{ responsive: true, maintainAspectRatio: false }" style="height:100%;" />
        </div>
      </div>
      <div class="rounded-lg border bg-card text-card-foreground p-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <div class="flex flex-col">
          <h3 class="text-sm font-medium mb-2">Por tipo</h3>
          <div class="flex-grow">
            <Doughnut :data="pieType()" :options="{ responsive: true, maintainAspectRatio: false, plugins:{ legend:{ position:'bottom' }}}" style="height:100%;" />
          </div>
        </div>
        <div class="flex flex-col">
          <h3 class="text-sm font-medium mb-2">Por rol</h3>
          <div class="flex-grow">
            <Bar :data="barRole()" :options="{ responsive: true, maintainAspectRatio: false, plugins:{ legend:{ display:false }}}" style="height:100%;" />
          </div>
        </div>
      </div>
    </div>

    <Separator class="my-6" />
    <div class="flex justify-end">
      <router-link :to="{ name: 'admin-reports' }" class="text-sm underline">Ver reportes</router-link>
    </div>
  </section>
</template>
