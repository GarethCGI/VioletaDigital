<script setup lang="ts">
import { useRouter } from "vue-router";
import { Separator } from "components/ui/separator";
import { Icon } from "@iconify/vue";
import { openUrl } from "@tauri-apps/plugin-opener";

const router = useRouter();

const roles = [
	{ key: "Docente", icon: "mdi:school", card: "rounded-lg border-2 bg-teal-500/15 hover:bg-teal-500/25 border-teal-500/40 text-teal-900", iconColor: "text-teal-700" },
	{ key: "Alumno", icon: "mdi:account-school", card: "rounded-lg border-2 bg-sky-500/15 hover:bg-sky-500/25 border-sky-500/40 text-sky-900", iconColor: "text-sky-700" },
	{ key: "Autoridad Educativa", icon: "mdi:account-tie", card: "rounded-lg border-2 bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-500/40 text-indigo-900", iconColor: "text-indigo-700" },
	{ key: "PAAE", icon: "mdi:human-greeting", card: "rounded-lg border-2 bg-pink-500/15 hover:bg-pink-500/25 border-pink-500/40 text-pink-900", iconColor: "text-pink-700" },
	{ key: "Otro", icon: "mdi:account", card: "rounded-lg border-2 bg-slate-500/15 hover:bg-slate-500/25 border-slate-500/40 text-slate-900", iconColor: "text-slate-700" },
] as const;

const links = [
	{
		name: "SIPINNA",
		description: "Sistema de Protección Integral",
		href: "https://www.gob.mx/sipinna",
		available: true,
		icon: "mdi:shield-account",
		color: "bg-blue-500/15 hover:bg-blue-500/25 border-blue-500/40",
		iconColor: "text-blue-700"
	},
	{
		name: "Dirección Escolar",
		description: "Autoridades de tu institución",
		href: "https://www.gob.mx/sep",
		available: true,
		icon: "mdi:school",
		color: "bg-green-500/15 hover:bg-green-500/25 border-green-500/40",
		iconColor: "text-green-700"
	},
	{
		name: "Instancia multidisciplinaria",
		description: "Equipo especializado en prevención",
		href: "#",
		available: false,
		icon: "mdi:account-group",
		color: "bg-purple-500/15 hover:bg-purple-500/25 border-purple-500/40",
		iconColor: "text-purple-700"
	},
];

function goToReportType(role: string) {
	router.push({ name: "report-type", query: { role } });
}

async function openExternal(url: string | undefined) {
  if (!url || url === "#") return;
  try {
    await openUrl(url);
  } catch (_) {
    if (typeof window !== "undefined" && typeof window.open === "function") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }
}
</script>

<template>
	<section class="mx-auto max-w-3xl px-4 py-8">
		<div class="text-center space-y-2 mb-8">
			<p class="text-sm text-muted-foreground">Estamos aquí para escucharte</p>
			<h2 class="text-2xl font-semibold" style="font-family: 'Kaushan Script', cursive;">Compartir una situación</h2>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
			<button
				v-for="r in roles"
				:key="r.key"
				:type="'button'"
				:class="['transition-all cursor-pointer flex items-center justify-center gap-2 py-3 px-4 font-semibold', r.card]"
				@click="goToReportType(r.key)"
			>
				<Icon :icon="r.icon" class="size-5" :class="r.iconColor" />
				{{ r.key }}
			</button>
		</div>

		<Separator class="my-8" />

		<div class="space-y-4">
			<div>
				<h3 class="text-lg font-medium">Recursos de apoyo</h3>
				<p class="text-sm text-muted-foreground">Organizaciones que pueden brindarte ayuda y orientación.</p>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 justify-items-center">
				<a v-for="l in links" :key="l.name" :href="l.available ? l.href : undefined"
					@click.prevent="l.available ? openExternal(l.href) : undefined"
					:class="[
						'relative rounded-lg border-2 p-4 transition-all w-full sm:w-64',
						l.color,
						l.available ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
					]">
					<div class="flex flex-col gap-2">
					<h4 class="font-medium text-sm leading-tight flex items-center gap-2">
						<Icon :icon="l.icon" class="size-5"
							:class="l.available ? l.iconColor : 'text-muted-foreground'" />
						{{ l.name }}
					</h4>
						<p class="text-xs text-muted-foreground">{{ l.description }}</p>
						<span v-if="!l.available" class="text-xs font-medium text-destructive mt-1">
							Temporalmente no disponible
						</span>
					</div>
				</a>
			</div>
		</div>
	</section>
</template>
