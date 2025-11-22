<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";

const route = useRoute();
const router = useRouter();

const role = (route.query.role as string) || "";

const types = [
  { key: "Violencia", card: "rounded-lg border-2 bg-red-500/15 hover:bg-red-500/25 border-red-500/40 text-red-900", icon: "alert" },
  { key: "Acoso", card: "rounded-lg border-2 bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-900", icon: "users" },
  { key: "Discriminación", card: "rounded-lg border-2 bg-purple-500/15 hover:bg-purple-500/25 border-purple-500/40 text-purple-900", icon: "tag" },
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
					<span v-if="t.icon === 'alert'">
						<svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
					</span>
					<span v-else-if="t.icon === 'users'">
						<svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75" /></svg>
					</span>
					<span v-else-if="t.icon === 'tag'">
						<svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 7l10 10a2 2 0 002.828 0l2.828-2.828a2 2 0 000-2.828L17.657 7a2 2 0 00-2.828 0L7 14.657a2 2 0 000 2.828L9.828 20a2 2 0 002.828 0l2.828-2.828a2 2 0 000-2.828L7 7z" /></svg>
					</span>
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
