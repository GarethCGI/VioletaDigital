import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "home",
		component: () => import("@/views/HomeView.vue"),
	},
	{
		path: "/report-type",
		name: "report-type",
		component: () => import("@/views/ReportTypeView.vue"),
	},
	{
		path: "/report-form",
		name: "report-form",
		component: () => import("@/views/ReportFormView.vue"),
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
