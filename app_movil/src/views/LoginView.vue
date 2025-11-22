<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Button } from 'components/ui/button';
import { Field, FieldLabel, FieldContent, FieldError } from 'components/ui/field';
import { Input } from 'components/ui/input';
import { Icon } from '@iconify/vue';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

async function submit() {
  loading.value = true;
  error.value = null;
  try {
    await auth.login(username.value, password.value);
    const redirect = (route.query.redirect as string) || '/admin';
    router.replace(redirect);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error de autenticación';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="mx-auto max-w-sm px-4 py-10">
    <div class="text-center space-y-2 mb-6">
      <h2 class="text-2xl font-semibold">Acceso de administración</h2>
      <p class="text-sm text-muted-foreground">Ingresa tus credenciales</p>
    </div>

    <div class="rounded-lg border bg-card text-card-foreground p-4 space-y-4">
      <div v-if="error" class="rounded-md border-2 border-destructive bg-destructive/10 p-2 text-sm flex items-center gap-2">
        <Icon icon="mdi:alert" class="size-4 text-destructive" />
        <span>{{ error }}</span>
      </div>

      <Field>
        <FieldLabel>Usuario</FieldLabel>
        <FieldContent>
          <Input v-model="username" autocomplete="username" />
        </FieldContent>
        <FieldError />
      </Field>

      <Field>
        <FieldLabel>Contraseña</FieldLabel>
        <FieldContent>
          <Input v-model="password" type="password" autocomplete="current-password" />
        </FieldContent>
        <FieldError />
      </Field>

      <Button class="w-full" :disabled="loading" @click="submit">
        <Icon v-if="loading" icon="mdi:loading" class="size-4 animate-spin" />
        <span v-else>Ingresar</span>
      </Button>
    </div>
  </section>
  
</template>
