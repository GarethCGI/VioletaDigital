<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button } from 'components/ui/button';
import { Field, FieldContent, FieldLabel, FieldDescription, FieldError } from 'components/ui/field';
import { Input } from 'components/ui/input';
import { Textarea } from 'components/ui/textarea';
import { useReport } from '@/composables/useReport';
import type { ReportRole, ReportType } from '@/types/report';

const route = useRoute();
const router = useRouter();
const { submitReport, loading, error } = useReport();

// Get role and type from query params
const role = computed(() => route.query.role as ReportRole);
const type = computed(() => route.query.type as ReportType);

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
						class="relative rounded-lg border-2 p-2 pr-4 pl-3 bg-blue-500/15 border-blue-500/40 flex items-center gap-2 min-w-[120px]">
						<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-blue-700" fill="none"
							viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						<span class="font-medium text-blue-800">Rol</span>
						<span class="ml-2 text-blue-900">{{ role }}</span>
					</div>
					<div
						class="relative rounded-lg border-2 p-2 pr-4 pl-3 bg-purple-500/15 border-purple-500/40 flex items-center gap-2 min-w-[120px]">
						<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-purple-700" fill="none"
							viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M7 7h10M7 11h10M7 15h6" />
						</svg>
						<span class="font-medium text-purple-800">Tipo</span>
						<span class="ml-2 text-purple-900">{{ type }}</span>
					</div>
				</div>
			</div>
			<Button variant="ghost" @click="goBack">Volver</Button>
		</div>

		<!-- Success Message -->
		<div v-if="showSuccess"
			class="mb-6 rounded-lg border bg-green-500/10 border-green-500/30 p-3 flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-green-700" fill="none" viewBox="0 0 24 24"
				stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
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
			<svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-destructive" fill="none" viewBox="0 0 24 24"
				stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
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
			<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-blue-700" fill="none" viewBox="0 0 24 24"
				stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
			</svg>
			<span>Tu privacidad está protegida. Comparte solo lo que te sientas cómodo compartiendo.</span>
		</div>

		<!-- Form -->
		<form @submit.prevent="handleSubmit" class="space-y-6">
			<!-- Description (required) -->
			<Field>
				<FieldLabel>
					<span class="inline-flex items-center gap-1">
						<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-red-600" fill="none"
							viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
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
						<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-blue-600" fill="none"
							viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M17.657 16.657L13.414 12.414A8 8 0 1112 20a8 8 0 015.657-3.343z" />
							<circle cx="12" cy="12" r="3" />
						</svg>
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
						<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-amber-600" fill="none"
							viewBox="0 0 24 24" stroke="currentColor">
							<rect width="18" height="18" x="3" y="4" rx="2" />
							<path d="M16 2v4M8 2v4M3 10h18" />
						</svg>
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
						<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-emerald-600" fill="none"
							viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75" />
						</svg>
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
						<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-indigo-600" fill="none"
							viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
						</svg>
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
					<svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					Cancelar
				</Button>
				<Button type="submit" class="h-12 flex items-center gap-2 justify-center" :disabled="loading">
					<svg v-if="loading" xmlns="http://www.w3.org/2000/svg" class="size-4 animate-spin" fill="none"
						viewBox="0 0 24 24" stroke="currentColor">
						<circle cx="12" cy="12" r="10" stroke-width="4" class="opacity-25" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M4 12a8 8 0 018-8"
							class="opacity-75" />
					</svg>
					<svg v-else xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
					{{ loading ? 'Enviando...' : 'Enviar reporte' }}
				</Button>
			</div>
		</form>
	</section>
</template>
