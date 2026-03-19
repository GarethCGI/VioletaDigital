<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useReport } from '@/composables/useReport';
import { Button } from 'components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Icon } from '@iconify/vue';
import type { Report, QuestionnaireRiskLevel } from '@/types/report';

const route = useRoute();
const { getReportById } = useReport();

const report = ref<Report | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

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

const informantRoleLabels = {
  VICTIM: 'Persona que vive la violencia',
  WITNESS: 'Testigo de la violencia',
  PREFER_NOT_TO_SAY: 'Prefiere no especificar',
  OTHER: 'Otro',
};

const frequencyLabels = {
  NEVER: 'Nunca',
  SOMETIMES: 'Algunas veces',
  OFTEN: 'Muchas veces',
  ALMOST_ALWAYS: 'Casi siempre',
};

const level3Labels = {
  IMMEDIATE: 'Sí, inmediatamente',
  AFTER_SOME: 'Sí, después de algunos episodios',
  MOST_EPISODES: 'Sí, después de la mayoría de episodios',
  PRE_EXISTING: 'No, existían antes',
  IN_APP: 'Mensaje anónimo dentro de la app',
  EMAIL: 'Correo electrónico',
  PHONE: 'Llamada telefónica',
  NO_CONTACT: 'Sin contacto',
  PSYCHOLOGICAL: 'Psicológico',
  ACADEMIC: 'Académico',
  LEGAL: 'Jurídico',
  SOCIAL: 'Social',
};

async function loadReport() {
  loading.value = true;
  error.value = null;
  try {
    const id = route.params.id as string;
    const res = await getReportById(id);
    console.log('[ReportDetailView] API response:', JSON.stringify(res, null, 2));
    
    if (res && res.success) {
      report.value = res.data;
      console.log('[ReportDetailView] Report data:', JSON.stringify(report.value, null, 2));
    } else {
      error.value = res.message || 'Failed to load report.';
    }
  } catch (err) {
    error.value = 'An error occurred while fetching the report.';
    console.error('[ReportDetailView] Error:', err);
  } finally {
    loading.value = false;
  }
}

function boolLabel(value?: boolean) {
  if (value === true) return 'Sí';
  if (value === false) return 'No';
  return 'Sin especificar';
}

onMounted(loadReport);
</script>

<template>
  <section class="mx-auto max-w-4xl px-4 py-8 space-y-6">
    <div v-if="loading" class="text-center">Cargando...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else>
      <div v-if="report && report.createdAt">
        <Card>
          <CardHeader>
            <CardTitle>Detalle del reporte</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div>
                <strong>Fecha:</strong> {{ new Date(report.createdAt).toLocaleString() }}
              </div>
              <div>
                <strong>Rol:</strong> {{ report.role }}
              </div>
              <div>
                <strong>Tipo:</strong> {{ report.type }}
              </div>
              <div>
                <strong>Ubicación:</strong> {{ report.location || 'N/A' }}
              </div>
              <div>
                <strong>Descripción:</strong>
                <p>{{ report.description || 'Sin descripción.' }}</p>
              </div>
              <div>
                <strong>Cuestionario:</strong>
                <span class="ml-2">{{ report.hasQuestionnaire ? 'Sí' : 'No' }}</span>
              </div>
              <div v-if="report.riskLevel">
                <strong>Riesgo:</strong>
                <span :class="['ml-2 inline-flex rounded-full border px-2 py-0.5 text-xs font-medium', riskStyles[report.riskLevel]]">
                  {{ riskLabels[report.riskLevel] }}
                </span>
              </div>
              <div v-if="report.informantRole">
                <strong>Informante:</strong>
                <span class="ml-2">{{ informantRoleLabels[report.informantRole] || report.informantRole }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card v-if="report.questionnaireData" class="mt-6">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Icon icon="mdi:clipboard-text" class="size-5" />
              Respuestas del cuestionario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-5 text-sm">
              <div>
                <p class="font-semibold">Nivel 0</p>
                <p class="text-muted-foreground">¿Quién responde?</p>
                <p>{{ informantRoleLabels[report.questionnaireData.level0.informantRole] || report.questionnaireData.level0.informantRole }}</p>
              </div>

              <div>
                <p class="font-semibold">Nivel 1</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div>
                    <p class="text-muted-foreground">Bromas hirientes</p>
                    <p>{{ frequencyLabels[report.questionnaireData.level1.hurtfulJokes] }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Celos/control/humillación</p>
                    <p>{{ frequencyLabels[report.questionnaireData.level1.jealousyControlHumiliation] }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Exclusión</p>
                    <p>{{ frequencyLabels[report.questionnaireData.level1.exclusion] }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Agresión física</p>
                    <p>{{ frequencyLabels[report.questionnaireData.level1.physicalAggression] }}</p>
                  </div>
                  <div class="md:col-span-2">
                    <p class="text-muted-foreground">Acoso digital</p>
                    <p>{{ frequencyLabels[report.questionnaireData.level1.digitalHarassment] }}</p>
                  </div>
                </div>
              </div>

              <div v-if="report.questionnaireData.level3">
                <p class="font-semibold">Nivel 3</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div>
                    <p class="text-muted-foreground">Síntomas tras violencia</p>
                    <p>{{ report.questionnaireData.level3.damageAfterViolence ? level3Labels[report.questionnaireData.level3.damageAfterViolence] : 'Sin especificar' }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Registrar anónimamente</p>
                    <p>{{ boolLabel(report.questionnaireData.level3.wantsAnonymousRecord) }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Señalar persona relacionada</p>
                    <p>{{ boolLabel(report.questionnaireData.level3.wantsToIdentifyRelatedPerson) }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Desea contacto anónimo</p>
                    <p>{{ boolLabel(report.questionnaireData.level3.wantsAnonymousContact) }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Contacto inicial preferido</p>
                    <p>{{ report.questionnaireData.level3.preferredInitialContact ? level3Labels[report.questionnaireData.level3.preferredInitialContact] : 'Sin especificar' }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Apoyo preferido</p>
                    <p>{{ report.questionnaireData.level3.preferredSupport ? level3Labels[report.questionnaireData.level3.preferredSupport] : 'Sin especificar' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div class="mt-6">
        <Button variant="outline" @click="$router.back()">Volver a reportes</Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Intentionally left minimal; uses existing utility classes */
</style>