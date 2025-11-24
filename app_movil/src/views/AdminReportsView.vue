<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useReport } from '@/composables/useReport';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Icon } from '@iconify/vue';

const { loading, error, getReports } = useReport();

const page = ref(1);
const limit = ref(10);
const total = ref(0);
const totalPages = ref(1);
const data = ref<any[]>([]);

const role = ref<string | undefined>(undefined);
const type = ref<string | undefined>(undefined);

async function load() {
  const q = new URLSearchParams({ page: String(page.value), limit: String(limit.value) });
  if (role.value) q.set('role', role.value);
  if (type.value) q.set('type', type.value);
  const res = await getReports(Number(q.get('page')), Number(q.get('limit')));
  if (res && res.success) {
    data.value = res.data;
    total.value = res.pagination.total;
    totalPages.value = res.pagination.totalPages;
  }
}

onMounted(load);
watch([page, limit], load);

function prev() { if (page.value > 1) page.value--; }
function next() { if (page.value < totalPages.value) page.value++; }

</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-8 h-screen flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-sm text-muted-foreground">Panel de administración</p>
        <h2 class="text-2xl font-semibold" style="font-family: 'Kaushan Script', cursive;">Reportes</h2>
      </div>
      <router-link :to="{ name: 'admin' }" class="text-sm underline">Volver a estadísticas</router-link>
    </div>

    <div class="rounded-lg border bg-card text-card-foreground p-3 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
      <div>
        <label class="text-xs text-muted-foreground">Rol</label>
        <Input v-model="role" placeholder="Docente, Alumno, ..." />
      </div>
      <div>
        <label class="text-xs text-muted-foreground">Tipo</label>
        <Input v-model="type" placeholder="Violencia, Acoso, ..." />
      </div>
      <div>
        <label class="text-xs text-muted-foreground">Por página</label>
        <Input v-model.number="limit" type="number" min="5" max="50" />
      </div>
      <div class="flex items-end">
        <Button class="w-full" :disabled="loading" @click="page = 1; load()">
          <Icon v-if="loading" icon="mdi:loading" class="size-4 animate-spin" />
          <span v-else>Aplicar</span>
        </Button>
      </div>
    </div>

    <div v-if="error" class="mb-4 rounded-md border-2 border-destructive bg-destructive/10 p-2 text-sm flex items-center gap-2">
      <Icon icon="mdi:alert" class="size-4 text-destructive" />
      <span>{{ error }}</span>
    </div>

    <div class="rounded-lg border overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-muted/50">
          <tr>
            <th class="text-left p-2">Fecha</th>
            <th class="text-left p-2">Rol</th>
            <th class="text-left p-2">Tipo</th>
            <th class="text-left p-2">Ubicación</th>
            <th class="text-left p-2 w-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in data" :key="r.id" class="border-t">
            <td class="p-2">{{ new Date(r.createdAt).toLocaleString() }}</td>
            <td class="p-2">{{ r.role }}</td>
            <td class="p-2">{{ r.type }}</td>
            <td class="p-2">{{ r.location || '-' }}</td>
            <td class="p-2">
              <span class="text-primary underline cursor-pointer" title="ID: {{ r.id }}">Ver</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between mt-3 text-sm">
      <div>Total: {{ total }}</div>
      <div class="flex gap-2 items-center">
        <Button variant="outline" :disabled="page<=1" @click="prev">Anterior</Button>
        <span>Página {{ page }} / {{ totalPages }}</span>
        <Button variant="outline" :disabled="page>=totalPages" @click="next">Siguiente</Button>
      </div>
    </div>

    <footer class="mt-auto bg-muted/50 p-4 text-center">
      <nav class="flex justify-center gap-4">
        <router-link to="/" class="text-sm text-muted-foreground">Inicio</router-link>
        <router-link to="/admin" class="text-sm text-muted-foreground">Panel</router-link>
        <router-link to="/admin-reports" class="text-sm text-muted-foreground">Reportes</router-link>
      </nav>
    </footer>
  </section>
</template>
