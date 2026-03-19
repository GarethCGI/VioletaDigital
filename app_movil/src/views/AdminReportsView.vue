<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useReport } from '@/composables/useReport';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Icon } from '@iconify/vue';
import type { Report, QuestionnaireInformantRole, QuestionnaireRiskLevel } from '@/types/report';

const { loading, error, getReports } = useReport();

const page = ref(1);
const limit = ref(10);
const total = ref(0);
const totalPages = ref(1);
const data = ref<Report[]>([]);

const role = ref<string | undefined>(undefined);
const type = ref<string | undefined>(undefined);
const informantRole = ref<QuestionnaireInformantRole | ''>('');
const riskLevel = ref<QuestionnaireRiskLevel | ''>('');
const hasQuestionnaire = ref<'ALL' | 'YES' | 'NO'>('ALL');

const riskStyles: Record<QuestionnaireRiskLevel, string> = {
	YELLOW: 'bg-yellow-500/15 text-yellow-800 border-yellow-500/40',
	ORANGE: 'bg-orange-500/15 text-orange-800 border-orange-500/40',
	RED: 'bg-red-500/15 text-red-800 border-red-500/40',
};

const riskLabels: Record<QuestionnaireRiskLevel, string> = {
	YELLOW: 'Amarillo',
	ORANGE: 'Naranja',
	RED: 'Rojo',
};

const informantLabels: Record<QuestionnaireInformantRole, string> = {
	VICTIM: 'Persona afectada',
	WITNESS: 'Testigo',
	PREFER_NOT_TO_SAY: 'Prefiere no decir',
	OTHER: 'Otro',
};

async function load() {
	console.log('[AdminReportsView] Loading reports with filters:', { role: role.value, type: type.value, informantRole: informantRole.value, riskLevel: riskLevel.value, hasQuestionnaire: hasQuestionnaire.value });
	
	const res = await getReports(page.value, limit.value, {
		role: role.value,
		type: type.value,
		informantRole: informantRole.value || undefined,
		riskLevel: riskLevel.value || undefined,
		hasQuestionnaire:
			hasQuestionnaire.value === 'ALL'
				? undefined
				: hasQuestionnaire.value === 'YES',
	});
	
	console.log('[AdminReportsView] API response:', JSON.stringify(res, null, 2));
	
	if (res && res.success) {
		data.value = res.data;
		total.value = res.pagination.total;
		totalPages.value = res.pagination.totalPages;
		console.log('[AdminReportsView] Loaded reports:', JSON.stringify(data.value, null, 2));
	}
}

onMounted(load);
watch([page, limit], load);

function prev() { if (page.value > 1) page.value--; }
function next() { if (page.value < totalPages.value) page.value++; }

</script>

<template>
	<section class="mx-auto max-w-6xl px-4 py-8 min-h-full flex flex-col">
		<div class="flex items-center justify-between mb-4">
			<div>
				<p class="text-sm text-muted-foreground">Panel de administración</p>
				<h2 class="text-2xl font-semibold" style="font-family: 'Kaushan Script', cursive;">Reportes</h2>
			</div>
			<router-link :to="{ name: 'admin' }" class="text-sm underline">Volver a estadísticas</router-link>
		</div>

		<div class="rounded-lg border bg-card text-card-foreground p-3 mb-4 grid grid-cols-1 md:grid-cols-7 gap-3">
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
			<div>
				<label class="text-xs text-muted-foreground">Informante</label>
				<select v-model="informantRole" class="h-9 w-full rounded-md border bg-background px-3 text-sm">
					<option value="">Todos</option>
					<option value="VICTIM">Persona afectada</option>
					<option value="WITNESS">Testigo</option>
					<option value="PREFER_NOT_TO_SAY">Prefiere no decir</option>
					<option value="OTHER">Otro</option>
				</select>
			</div>
			<div>
				<label class="text-xs text-muted-foreground">Riesgo</label>
				<select v-model="riskLevel" class="h-9 w-full rounded-md border bg-background px-3 text-sm">
					<option value="">Todos</option>
					<option value="YELLOW">Amarillo</option>
					<option value="ORANGE">Naranja</option>
					<option value="RED">Rojo</option>
				</select>
			</div>
			<div>
				<label class="text-xs text-muted-foreground">Cuestionario</label>
				<select v-model="hasQuestionnaire" class="h-9 w-full rounded-md border bg-background px-3 text-sm">
					<option value="ALL">Todos</option>
					<option value="YES">Con cuestionario</option>
					<option value="NO">Sin cuestionario</option>
				</select>
			</div>
			<div class="flex items-end">
				<Button class="w-full" :disabled="loading" @click="page = 1; load()">
					<Icon v-if="loading" icon="mdi:loading" class="size-4 animate-spin" />
					<span v-else>Aplicar</span>
				</Button>
			</div>
		</div>

		<div v-if="error"
			class="mb-4 rounded-md border-2 border-destructive bg-destructive/10 p-2 text-sm flex items-center gap-2">
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
						<th class="text-left p-2">Informante</th>
						<th class="text-left p-2">Riesgo</th>
						<th class="text-left p-2">Cuestionario</th>
						<th class="text-left p-2">Ubicación</th>
						<th class="text-left p-2 w-1">Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="r in data" :key="r.id" class="border-t">
						<td class="p-2">{{ new Date(r.createdAt).toLocaleString() }}</td>
						<td class="p-2">{{ r.role }}</td>
						<td class="p-2">{{ r.type }}</td>
						<td class="p-2">{{ r.informantRole ? informantLabels[r.informantRole] : '-' }}</td>
						<td class="p-2">
							<span
								v-if="r.riskLevel"
								:class="['inline-flex rounded-full border px-2 py-0.5 text-xs font-medium', riskStyles[r.riskLevel]]"
							>
								{{ riskLabels[r.riskLevel] }}
							</span>
							<span v-else class="text-muted-foreground">-</span>
						</td>
						<td class="p-2">
							<span
								:class="[
									'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium',
									r.hasQuestionnaire ? 'bg-emerald-500/15 text-emerald-800 border-emerald-500/40' : 'bg-slate-500/10 text-slate-700 border-slate-500/30'
								]"
							>
								{{ r.hasQuestionnaire ? 'Sí' : 'No' }}
							</span>
						</td>
						<td class="p-2">{{ r.location || '-' }}</td>
						<td class="p-2">
							<span class="text-primary underline cursor-pointer" title="ID: {{ r.id }}">
								<router-link :to="{ name: 'report-detail', params: { id: r.id } }">Ver</router-link>
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="flex items-center justify-between mt-3 text-sm">
			<div>Total: {{ total }}</div>
			<div class="flex gap-2 items-center">
				<Button variant="outline" :disabled="page <= 1" @click="prev">Anterior</Button>
				<span>Página {{ page }} / {{ totalPages }}</span>
				<Button variant="outline" :disabled="page >= totalPages" @click="next">Siguiente</Button>
			</div>
		</div>
	</section>
</template>
