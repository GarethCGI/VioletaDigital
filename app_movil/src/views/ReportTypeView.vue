<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import { Icon } from "@iconify/vue";

const route = useRoute();
const router = useRouter();

const role = (route.query.role as string) || "";

const types = [
  { key: "Violencia", card: "rounded-lg border-2 bg-red-500/15 hover:bg-red-500/25 border-red-500/40 text-red-900", icon: "mdi:alert-circle", iconColor: "text-red-700" },
  { key: "Acoso", card: "rounded-lg border-2 bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-900", icon: "mdi:account-multiple", iconColor: "text-amber-700" },
  { key: "Discriminación", card: "rounded-lg border-2 bg-purple-500/15 hover:bg-purple-500/25 border-purple-500/40 text-purple-900", icon: "mdi:tag", iconColor: "text-purple-700" },
] as const;

function back() {
	router.back();
}

function chooseType(type: string) {
	router.push({ path: '/report-form', query: { role, type } });
}
</script>

<template>
	<section class="mx-auto max-w-3xl px-4 py-8">
		<div class="flex items-center justify-between mb-6">
			<div>
				<p class="text-sm text-muted-foreground">¿Qué está pasando?</p>
				<h2 class="text-2xl font-semibold" style="font-family: 'Kaushan Script', cursive;">
					{{ role ? `Relacionado con: ${role}` : 'Cuéntanos más' }}
				</h2>
			</div>
			<Button variant="ghost" @click="back">Volver</Button>
		</div>
		<div class="mb-6 rounded-lg border bg-card text-card-foreground p-3 text-xs text-muted-foreground">
			Recuerda que tu privacidad está protegida. Comparte solo lo que te sientas cómodo compartiendo.
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
			<button
				v-for="t in types"
				:key="t.key"
				:type="'button'"
				:class="['transition-all cursor-pointer flex flex-col items-center justify-center py-4 px-2', t.card]"
				@click="chooseType(t.key)"
			>
				<span class="flex items-center gap-2 font-semibold text-base">
					<Icon :icon="t.icon" class="size-5" :class="t.iconColor" />
					{{ t.key }}
				</span>
			</button>
		</div>

		<Separator class="my-8" />
		<p class="text-sm text-muted-foreground">
			Después de elegir, podrás continuar al formulario correspondiente.
		</p>
	</section>
</template>
