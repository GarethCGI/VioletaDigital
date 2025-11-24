<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useReport } from '@/composables/useReport';
import { Button } from 'components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const route = useRoute();
const { getReportById } = useReport();

const report = ref<any>(null);
const loading = ref(false);
const error = ref<string | null>(null);

async function loadReport() {
  loading.value = true;
  error.value = null;
  try {
    const id = route.params.id as string;
    const res = await getReportById(id);
    if (res && res.success) {
      report.value = res.data;
    } else {
      error.value = res.message || 'Failed to load report.';
    }
  } catch (err) {
    error.value = 'An error occurred while fetching the report.';
  } finally {
    loading.value = false;
  }
}

onMounted(loadReport);
</script>

<template>
  <section class="mx-auto max-w-4xl px-4 py-8">
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else>
      <div v-if="report && report.createdAt">
        <Card>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div>
                <strong>Date:</strong> {{ new Date(report.createdAt).toLocaleString() }}
              </div>
              <div>
                <strong>Role:</strong> {{ report.role }}
              </div>
              <div>
                <strong>Type:</strong> {{ report.type }}
              </div>
              <div>
                <strong>Location:</strong> {{ report.location || 'N/A' }}
              </div>
              <div>
                <strong>Description:</strong>
                <p>{{ report.description || 'No description provided.' }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div class="mt-6">
        <Button variant="outline" @click="$router.back()">Back to Reports</Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Add any specific styles here */
</style>