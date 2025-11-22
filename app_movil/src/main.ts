import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/styles/globals.css";

import { createPinia } from "pinia";
import { createPlugin } from "@tauri-store/pinia";

const app = createApp(App);

const pinia = createPinia();
// Enable Tauri Pinia plugin for device-backed persistence and sync
pinia.use(createPlugin());

app.use(pinia);
app.use(router);
app.mount("#app");
