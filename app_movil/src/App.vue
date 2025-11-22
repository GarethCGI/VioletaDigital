<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import Dialog from "components/ui/dialog/Dialog.vue";
import { DialogTrigger } from "components/ui/dialog";
import DialogContent from "components/ui/dialog/DialogContent.vue";
import DialogHeader from "components/ui/dialog/DialogHeader.vue";
import DialogTitle from "components/ui/dialog/DialogTitle.vue";
import DialogDescription from "components/ui/dialog/DialogDescription.vue";
import DialogFooter from "components/ui/dialog/DialogFooter.vue";
import { Button } from "components/ui/button";

const open = ref(false);
</script>

<template>
	<div class="min-h-dvh flex flex-col">
		<header class="w-full border-b">
			<div class="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between gap-3">
				<img src="/logo.png" alt="Violeta Digital" class="size-8 rounded-md object-contain" />
				   <h1 class="text-xl font-semibold tracking-tight" style="font-family: 'Kaushan Script', cursive;">Violeta Digital</h1>
				<div class="flex-1"></div>
				<Dialog v-model:open="open">
					<DialogTrigger as-child>
						<Button variant="ghost" size="sm">Privacidad</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Privacidad y anonimato</DialogTitle>
							<DialogDescription>
								Tus reportes se procesan sin datos de identificación. No recopilamos nombre, correo ni
								identificadores del dispositivo. Tu información solo se usa para atender el caso.
							</DialogDescription>
						</DialogHeader>
						<div class="text-sm space-y-2">
							<p>
								Recomendaciones:
							</p>
							<ul class="list-disc pl-5 space-y-1">
								<li>Evita incluir datos personales en el texto del reporte.</li>
								<li>No adjuntes información sensible que no quieras compartir.</li>
								<li>Si necesitas seguimiento, podrás optar por compartir un contacto voluntariamente más
									adelante.</li>
							</ul>
						</div>
						<DialogFooter>
							<Button variant="secondary" @click="open = false">Cerrar</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</header>
		<main class="flex-1">
			<RouterView />
		</main>
	</div>

</template>

<style scoped></style>