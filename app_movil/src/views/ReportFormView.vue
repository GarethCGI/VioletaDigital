<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button } from 'components/ui/button';
import { Field, FieldContent, FieldLabel, FieldDescription, FieldError } from 'components/ui/field';
import { Input } from 'components/ui/input';
import { Textarea } from 'components/ui/textarea';
import { Icon } from '@iconify/vue';
import { useReport } from '@/composables/useReport';
import type {
	ReportRole,
	ReportType,
	QuestionnaireFrequency,
	QuestionnaireInformantRole,
	QuestionnaireRiskLevel,
} from '@/types/report';

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

const attachQuestionnaire = ref(true);

const informantRole = ref<QuestionnaireInformantRole>('PREFER_NOT_TO_SAY');
const hurtfulJokes = ref<QuestionnaireFrequency>('NEVER');
const jealousyControlHumiliation = ref<QuestionnaireFrequency>('NEVER');
const exclusion = ref<QuestionnaireFrequency>('NEVER');
const physicalAggression = ref<QuestionnaireFrequency>('NEVER');
const digitalHarassment = ref<QuestionnaireFrequency>('NEVER');

const damageAfterViolence = ref<'IMMEDIATE' | 'AFTER_SOME' | 'MOST_EPISODES' | 'PRE_EXISTING' | ''>('');
const wantsAnonymousRecord = ref<boolean | null>(null);
const wantsToIdentifyRelatedPerson = ref<boolean | null>(null);
const wantsAnonymousContact = ref<boolean | null>(null);
const preferredInitialContact = ref<'IN_APP' | 'EMAIL' | 'PHONE' | 'NO_CONTACT' | ''>('');
const preferredSupport = ref<'PSYCHOLOGICAL' | 'ACADEMIC' | 'LEGAL' | 'SOCIAL' | ''>('');

// Validation
const descriptionError = ref('');
const showSuccess = ref(false);

/* const riskStyles: Record<QuestionnaireRiskLevel, string> = {
	YELLOW: 'bg-yellow-500/15 text-yellow-800 border-yellow-500/40',
	ORANGE: 'bg-orange-500/15 text-orange-800 border-orange-500/40',
	RED: 'bg-red-500/15 text-red-800 border-red-500/40',
}; */

const scoreMap: Record<QuestionnaireFrequency, number> = {
	NEVER: 0,
	SOMETIMES: 1,
	OFTEN: 2,
	ALMOST_ALWAYS: 3,
};

const computedRiskLevel = computed<QuestionnaireRiskLevel>(() => {
	const totalScore =
		scoreMap[hurtfulJokes.value] +
		scoreMap[jealousyControlHumiliation.value] +
		scoreMap[exclusion.value] +
		scoreMap[physicalAggression.value] +
		scoreMap[digitalHarassment.value];

	if (
		totalScore >= 10 ||
		physicalAggression.value === 'ALMOST_ALWAYS' ||
		digitalHarassment.value === 'ALMOST_ALWAYS'
	) {
		return 'RED';
	}

	if (totalScore >= 6 || scoreMap[jealousyControlHumiliation.value] >= 2) {
		return 'ORANGE';
	}

	return 'YELLOW';
});

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

	console.log('[ReportFormView] attachQuestionnaire.value:', attachQuestionnaire.value);
	
	const payload = {
		role: role.value,
		type: type.value,
		description: description.value,
		location: location.value || undefined,
		date: date.value || undefined,
		witnesses: witnesses.value || undefined,
		additionalInfo: additionalInfo.value || undefined,
		questionnaireData: attachQuestionnaire.value
			? {
					level0: {
						informantRole: informantRole.value,
					},
					level1: {
						hurtfulJokes: hurtfulJokes.value,
						jealousyControlHumiliation: jealousyControlHumiliation.value,
						exclusion: exclusion.value,
						physicalAggression: physicalAggression.value,
						digitalHarassment: digitalHarassment.value,
					},
					level3: {
						damageAfterViolence: damageAfterViolence.value || undefined,
						wantsAnonymousRecord: wantsAnonymousRecord.value ?? undefined,
						wantsToIdentifyRelatedPerson: wantsToIdentifyRelatedPerson.value ?? undefined,
						wantsAnonymousContact: wantsAnonymousContact.value ?? undefined,
						preferredInitialContact: preferredInitialContact.value || undefined,
						preferredSupport: preferredSupport.value || undefined,
					},
			  }
			: undefined,
		riskLevel: attachQuestionnaire.value ? computedRiskLevel.value : undefined,
	};
	console.log('[ReportFormView] Payload being submitted:', JSON.stringify(payload, null, 2));

	const success = await submitReport(payload);

	if (success) {
		showSuccess.value = true;
		// Reset form
		description.value = '';
		location.value = '';
		date.value = '';
		witnesses.value = '';
		additionalInfo.value = '';
		informantRole.value = 'PREFER_NOT_TO_SAY';
		hurtfulJokes.value = 'NEVER';
		jealousyControlHumiliation.value = 'NEVER';
		exclusion.value = 'NEVER';
		physicalAggression.value = 'NEVER';
		digitalHarassment.value = 'NEVER';
		damageAfterViolence.value = '';
		wantsAnonymousRecord.value = null;
		wantsToIdentifyRelatedPerson.value = null;
		wantsAnonymousContact.value = null;
		preferredInitialContact.value = '';
		preferredSupport.value = '';

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

			<div class="rounded-lg border bg-card text-card-foreground p-4 space-y-4">
				<div class="flex items-center justify-between gap-2">
					<div>
						<p class="text-sm font-medium">Cuestionario de valoración</p>
						<p class="text-xs text-muted-foreground">Puedes adjuntar respuestas para dar más contexto a tu reporte.</p>
					</div>
					<label class="inline-flex items-center gap-2 text-sm">
						<input v-model="attachQuestionnaire" type="checkbox" class="size-4" />
						Adjuntar
					</label>
				</div>

				<div v-if="attachQuestionnaire" class="space-y-5">
					<div>
						<label class="text-sm font-medium">Nivel 0: ¿Quién responde?</label>
						<select v-model="informantRole" class="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm">
							<option value="VICTIM">Soy la persona que vive la violencia</option>
							<option value="WITNESS">Soy testigo de la violencia</option>
							<option value="PREFER_NOT_TO_SAY">Prefiero no especificar</option>
							<option value="OTHER">Otro</option>
						</select>
					</div>

					<div class="space-y-3">
						<p class="text-sm font-medium">Nivel 1: Frecuencia de señales</p>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
							<label class="space-y-1">
								<span class="text-xs text-muted-foreground">Bromas hirientes</span>
								<select v-model="hurtfulJokes" class="h-9 w-full rounded-md border bg-background px-3 text-sm">
									<option value="NEVER">Nunca</option>
									<option value="SOMETIMES">Algunas veces</option>
									<option value="OFTEN">Muchas veces</option>
									<option value="ALMOST_ALWAYS">Casi siempre</option>
								</select>
							</label>
							<label class="space-y-1">
								<span class="text-xs text-muted-foreground">Celos/control/humillación</span>
								<select v-model="jealousyControlHumiliation" class="h-9 w-full rounded-md border bg-background px-3 text-sm">
									<option value="NEVER">Nunca</option>
									<option value="SOMETIMES">Algunas veces</option>
									<option value="OFTEN">Muchas veces</option>
									<option value="ALMOST_ALWAYS">Casi siempre</option>
								</select>
							</label>
							<label class="space-y-1">
								<span class="text-xs text-muted-foreground">Exclusión o menosprecio</span>
								<select v-model="exclusion" class="h-9 w-full rounded-md border bg-background px-3 text-sm">
									<option value="NEVER">Nunca</option>
									<option value="SOMETIMES">Algunas veces</option>
									<option value="OFTEN">Muchas veces</option>
									<option value="ALMOST_ALWAYS">Casi siempre</option>
								</select>
							</label>
							<label class="space-y-1">
								<span class="text-xs text-muted-foreground">Agresión física</span>
								<select v-model="physicalAggression" class="h-9 w-full rounded-md border bg-background px-3 text-sm">
									<option value="NEVER">Nunca</option>
									<option value="SOMETIMES">Algunas veces</option>
									<option value="OFTEN">Muchas veces</option>
									<option value="ALMOST_ALWAYS">Casi siempre</option>
								</select>
							</label>
							<label class="space-y-1 md:col-span-2">
								<span class="text-xs text-muted-foreground">Acoso digital</span>
								<select v-model="digitalHarassment" class="h-9 w-full rounded-md border bg-background px-3 text-sm">
									<option value="NEVER">Nunca</option>
									<option value="SOMETIMES">Algunas veces</option>
									<option value="OFTEN">Muchas veces</option>
									<option value="ALMOST_ALWAYS">Casi siempre</option>
								</select>
							</label>
						</div>
					</div>

					<div class="space-y-3">
						<p class="text-sm font-medium">Nivel 3: Seguimiento y apoyo (opcional)</p>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
							<label class="space-y-1 md:col-span-2">
								<span class="text-xs text-muted-foreground">¿Los síntomas iniciaron después de la violencia?</span>
								<select v-model="damageAfterViolence" class="h-9 w-full rounded-md border bg-background px-3 text-sm">
									<option value="">Sin especificar</option>
									<option value="IMMEDIATE">Sí, inmediatamente</option>
									<option value="AFTER_SOME">Sí, después de algunos episodios</option>
									<option value="MOST_EPISODES">Sí, después de la mayoría de episodios</option>
									<option value="PRE_EXISTING">No, existían antes</option>
								</select>
							</label>
							<label class="space-y-1">
								<span class="text-xs text-muted-foreground">¿Registrar anónimamente?</span>
								<select v-model="wantsAnonymousRecord" class="h-9 w-full rounded-md border bg-background px-3 text-sm">
									<option :value="null">Sin especificar</option>
									<option :value="true">Sí</option>
									<option :value="false">No</option>
								</select>
							</label>
							<label class="space-y-1">
								<span class="text-xs text-muted-foreground">¿Señalar persona relacionada?</span>
								<select v-model="wantsToIdentifyRelatedPerson" class="h-9 w-full rounded-md border bg-background px-3 text-sm">
									<option :value="null">Sin especificar</option>
									<option :value="true">Sí</option>
									<option :value="false">No</option>
								</select>
							</label>
							<label class="space-y-1">
								<span class="text-xs text-muted-foreground">¿Desea contacto anónimo?</span>
								<select v-model="wantsAnonymousContact" class="h-9 w-full rounded-md border bg-background px-3 text-sm">
									<option :value="null">Sin especificar</option>
									<option :value="true">Sí</option>
									<option :value="false">No</option>
								</select>
							</label>
							<label class="space-y-1">
								<span class="text-xs text-muted-foreground">Contacto inicial</span>
								<select v-model="preferredInitialContact" class="h-9 w-full rounded-md border bg-background px-3 text-sm">
									<option value="">Sin especificar</option>
									<option value="IN_APP">Mensaje en app</option>
									<option value="EMAIL">Correo</option>
									<option value="PHONE">Llamada</option>
									<option value="NO_CONTACT">Sin contacto</option>
								</select>
							</label>
							<label class="space-y-1 md:col-span-2">
								<span class="text-xs text-muted-foreground">Apoyo preferido</span>
								<select v-model="preferredSupport" class="h-9 w-full rounded-md border bg-background px-3 text-sm">
									<option value="">Sin especificar</option>
									<option value="PSYCHOLOGICAL">Psicológico</option>
									<option value="ACADEMIC">Académico</option>
									<option value="LEGAL">Jurídico</option>
									<option value="SOCIAL">Social</option>
								</select>
							</label>
						</div>
					</div>
				</div>
			</div>

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
