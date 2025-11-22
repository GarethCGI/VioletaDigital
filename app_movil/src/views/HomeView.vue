<script setup lang="ts">
import { useRouter } from "vue-router";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import { Shield, School, Users } from "lucide-vue-next";
import { openUrl } from "@tauri-apps/plugin-opener";

const router = useRouter();

const roles = [
	{ key: "Docente", color: "default" },
	{ key: "Alumno", color: "secondary" },
	{ key: "Autoridad Educativa", color: "outline" },
	{ key: "PAAE", color: "ghost" },
	{ key: "Otro", color: "default" },
] as const;

const links = [
	{
		name: "SIPINNA",
		description: "Sistema de Protección Integral",
		href: "#",
		available: true,
		icon: Shield,
		color: "bg-blue-500/15 hover:bg-blue-500/25 border-blue-500/40",
		iconColor: "text-blue-700"
	},
	{
		name: "Dirección Escolar",
		description: "Autoridades de tu institución",
		href: "#",
		available: true,
		icon: School,
		color: "bg-green-500/15 hover:bg-green-500/25 border-green-500/40",
		iconColor: "text-green-700"
	},
	{
		name: "Instancia multidisciplinaria",
		description: "Equipo especializado en prevención",
		href: "#",
		available: false,
		icon: Users,
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
			<Button v-for="r in roles" :key="r.key" class="h-12" :variant="r.color as any"
				@click="goToReportType(r.key)">
				{{ r.key }}
			</Button>
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
							<component :is="l.icon" class="size-5"
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
