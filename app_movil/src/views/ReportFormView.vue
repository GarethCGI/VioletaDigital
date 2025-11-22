<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button } from 'components/ui/button';
import { Field, FieldContent, FieldLabel, FieldDescription, FieldError } from 'components/ui/field';
import { Input } from 'components/ui/input';
import { Textarea } from 'components/ui/textarea';
import { Icon } from '@iconify/vue';
import { useReport } from '@/composables/useReport';
import type { ReportRole, ReportType } from '@/types/report';

const route = useRoute();
const router = useRouter();
const { submitReport, loading, error } = useReport();

// Get role and type from query params
const role = computed(() => route.query.role as ReportRole);
const type = computed(() => route.query.type as ReportType);

// Role color mapping to match HomeView
const roleColors = {
	'Docente': { bg: 'bg-teal-500/15', border: 'border-teal-500/40', text: 'text-teal-800', textDark: 'text-teal-900', icon: 'mdi:school', iconColor: 'text-teal-700' },
	'Alumno': { bg: 'bg-sky-500/15', border: 'border-sky-500/40', text: 'text-sky-800', textDark: 'text-sky-900', icon: 'mdi:account-school', iconColor: 'text-sky-700' },
	'Autoridad Educativa': { bg: 'bg-indigo-500/15', border: 'border-indigo-500/40', text: 'text-indigo-800', textDark: 'text-indigo-900', icon: 'mdi:account-tie', iconColor: 'text-indigo-700' },
	'PAAE': { bg: 'bg-pink-500/15', border: 'border-pink-500/40', text: 'text-pink-800', textDark: 'text-pink-900', icon: 'mdi:human-greeting', iconColor: 'text-pink-700' },
	'Otro': { bg: 'bg-slate-500/15', border: 'border-slate-500/40', text: 'text-slate-800', textDark: 'text-slate-900', icon: 'mdi:account', iconColor: 'text-slate-700' },
};

// Type color mapping to match ReportTypeView
const typeColors = {
	'Violencia': { bg: 'bg-red-500/15', border: 'border-red-500/40', text: 'text-red-800', textDark: 'text-red-900', icon: 'mdi:alert-circle', iconColor: 'text-red-700' },
	'Acoso': { bg: 'bg-amber-500/15', border: 'border-amber-500/40', text: 'text-amber-800', textDark: 'text-amber-900', icon: 'mdi:account-multiple', iconColor: 'text-amber-700' },
	'Discriminación': { bg: 'bg-purple-500/15', border: 'border-purple-500/40', text: 'text-purple-800', textDark: 'text-purple-900', icon: 'mdi:tag', iconColor: 'text-purple-700' },
};

const currentRoleColor = computed(() => roleColors[role.value as keyof typeof roleColors] || roleColors['Otro']);
const currentTypeColor = computed(() => typeColors[type.value as keyof typeof typeColors] || typeColors['Violencia']);

// Form fields
const description = ref('');
const location = ref('');
const date = ref('');
const witnesses = ref('');
const additionalInfo = ref('');

// Validation
const descriptionError = ref('');
const showSuccess = ref(false);

const validateForm = () => {
	descriptionError.value = '';

	if (!description.value.trim()) {
		descriptionError.value = 'La descripción es obligatoria';
		return false;
	}

	if (description.value.length < 20) {
		descriptionError.value = 'La descripción debe tener al menos 20 caracteres';
		return false;
	}

	return true;
};

const handleSubmit = async () => {
	if (!validateForm()) return;

	const success = await submitReport({
		role: role.value,
		type: type.value,
		description: description.value,
		location: location.value || undefined,
		date: date.value || undefined,
		witnesses: witnesses.value || undefined,
		additionalInfo: additionalInfo.value || undefined,
	});

	if (success) {
		showSuccess.value = true;
		// Reset form
		description.value = '';
		location.value = '';
		date.value = '';
		witnesses.value = '';
		additionalInfo.value = '';

		// Redirect after 2 seconds
		setTimeout(() => {
			router.push('/');
		}, 2000);
	}
};

const goBack = () => {
	router.back();
};
</script>

<template>
	<section class="mx-auto max-w-3xl px-4 py-8">
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<div>
				<p class="text-sm text-muted-foreground">Completa el formulario</p>
				<h2 class="text-2xl font-semibold" style="font-family: 'Kaushan Script', cursive;">Crear reporte</h2>
				<div class="mt-2 flex flex-wrap gap-3 text-xs">
					<div
						:class="['relative rounded-lg border-2 p-2 pr-4 pl-3 flex items-center gap-2 min-w-[120px]', currentRoleColor.bg, currentRoleColor.border]">
						<Icon :icon="currentRoleColor.icon" class="size-4" :class="currentRoleColor.iconColor" />
						<span class="font-medium" :class="currentRoleColor.text">Rol</span>
						<span class="ml-2" :class="currentRoleColor.textDark">{{ role }}</span>
					</div>
					<div
						:class="['relative rounded-lg border-2 p-2 pr-4 pl-3 flex items-center gap-2 min-w-[120px]', currentTypeColor.bg, currentTypeColor.border]">
						<Icon :icon="currentTypeColor.icon" class="size-4" :class="currentTypeColor.iconColor" />
						<span class="font-medium" :class="currentTypeColor.text">Tipo</span>
						<span class="ml-2" :class="currentTypeColor.textDark">{{ type }}</span>
					</div>
				</div>
			</div>
			<Button variant="ghost" @click="goBack">Volver</Button>
		</div>

		<!-- Success Message -->
		<div v-if="showSuccess"
			class="mb-6 rounded-lg border bg-green-500/10 border-green-500/30 p-3 flex items-center gap-2">
			<Icon icon="mdi:check-circle" class="size-5 text-green-700" />
			<div>
				<p class="text-sm font-medium text-foreground">Reporte enviado exitosamente</p>
				<p class="text-xs text-muted-foreground mt-1">
					Serás redirigido al inicio...
				</p>
			</div>
		</div>

		<!-- Error Message -->
		<div v-if="error"
			class="mb-6 rounded-lg border-2 border-destructive bg-destructive/10 p-3 flex items-center gap-2">
			<Icon icon="mdi:close-circle" class="size-5 text-destructive" />
			<div>
				<p class="text-sm font-medium text-destructive">Error al enviar el reporte</p>
				<p class="text-xs text-muted-foreground mt-1">
					{{ error }}
				</p>
			</div>
		</div>

		<!-- Helper card -->
		<div
			class="mb-6 rounded-lg border bg-card text-card-foreground p-3 text-xs text-muted-foreground flex items-center gap-2">
			<Icon icon="mdi:information" class="size-4 text-blue-700" />
			<span>Tu privacidad está protegida. Comparte solo lo que te sientas cómodo compartiendo.</span>
		</div>

		<!-- Form -->
		<form @submit.prevent="handleSubmit" class="space-y-6">
			<!-- Description (required) -->
			<Field>
				<FieldLabel>
					<span class="inline-flex items-center gap-1">
						<Icon icon="mdi:alert-circle" class="size-4 text-red-600" />
						Descripción del incidente <span class="text-destructive">*</span>
					</span>
				</FieldLabel>
				<FieldDescription>
					Describe detalladamente lo ocurrido (mínimo 20 caracteres)
				</FieldDescription>
				<FieldContent>
					<Textarea v-model="description" placeholder="Describe lo que sucedió..." rows="6"
						:aria-invalid="!!descriptionError"
						class="resize-y bg-white dark:bg-white text-gray-900 shadow-sm" />
				</FieldContent>
				<FieldError v-if="descriptionError">
					{{ descriptionError }}
				</FieldError>
			</Field>

			<!-- Location -->
			<Field>
				<FieldLabel>
					<span class="inline-flex items-center gap-1">
						<Icon icon="mdi:map-marker" class="size-4 text-blue-600" />
						Ubicación
					</span>
				</FieldLabel>
				<FieldDescription>
					¿Dónde ocurrió el incidente? (opcional)
				</FieldDescription>
				<FieldContent>
					<Input v-model="location" type="text" placeholder="Ej: Aula 302, Patio, Biblioteca..."
						class="bg-white dark:bg-white text-gray-900 shadow-sm" />
				</FieldContent>
			</Field>

			<!-- Date -->
			<Field>
				<FieldLabel>
					<span class="inline-flex items-center gap-1">
						<Icon icon="mdi:calendar" class="size-4 text-amber-600" />
						Fecha del incidente
					</span>
				</FieldLabel>
				<FieldDescription>
					¿Cuándo ocurrió? (opcional)
				</FieldDescription>
				<FieldContent>
					<Input v-model="date" type="date" :max="new Date().toISOString().split('T')[0]"
						class="bg-white dark:bg-white text-gray-900 shadow-sm" />
				</FieldContent>
			</Field>

			<!-- Witnesses -->
			<Field>
				<FieldLabel>
					<span class="inline-flex items-center gap-1">
						<Icon icon="mdi:account-multiple" class="size-4 text-emerald-600" />
						Testigos
					</span>
				</FieldLabel>
				<FieldDescription>
					¿Hubo testigos del incidente? (opcional)
				</FieldDescription>
				<FieldContent>
					<Textarea v-model="witnesses" placeholder="Nombres o descripción de los testigos..." rows="3"
						class="bg-white dark:bg-white text-gray-900 shadow-sm" />
				</FieldContent>
			</Field>

			<!-- Additional Info -->
			<Field>
				<FieldLabel>
					<span class="inline-flex items-center gap-1">
						<Icon icon="mdi:information" class="size-4 text-indigo-600" />
						Información adicional
					</span>
				</FieldLabel>
				<FieldDescription>
					Cualquier otro detalle relevante (opcional)
				</FieldDescription>
				<FieldContent>
					<Textarea v-model="additionalInfo" placeholder="Información adicional..." rows="4"
						class="bg-white dark:bg-white text-gray-900 shadow-sm" />
				</FieldContent>
			</Field>

			<!-- Actions -->
			<div class="grid grid-cols-2 gap-3">
				<Button type="button" variant="outline" class="h-12 flex items-center gap-2 justify-center"
					:disabled="loading" @click="goBack">
					<Icon icon="mdi:chevron-left" class="size-4" />
					Cancelar
				</Button>
				<Button type="submit" class="h-12 flex items-center gap-2 justify-center" :disabled="loading">
					<Icon v-if="loading" icon="mdi:loading" class="size-4 animate-spin" />
					<Icon v-else icon="mdi:check" class="size-4" />
					{{ loading ? 'Enviando...' : 'Enviar reporte' }}
				</Button>
			</div>
		</form>
	</section>
</template>
