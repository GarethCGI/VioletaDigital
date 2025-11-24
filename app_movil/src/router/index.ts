import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth";

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
	{
		path: "/login",
		name: "login",
		component: () => import("@/views/LoginView.vue"),
	},
	{
		path: "/admin",
		name: "admin",
		component: () => import("@/views/AdminDashboardView.vue"),
		meta: { requiresAuth: true },
	},
	{
		path: "/admin/reports",
		name: "admin-reports",
		component: () => import("@/views/AdminReportsView.vue"),
		meta: { requiresAuth: true },
	},
	{
		path: "/admin/reports/:id",
		name: "report-detail",
		component: () => import("@/views/ReportDetailView.vue"),
		meta: { requiresAuth: true },
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

router.beforeEach((to) => {
	const auth = useAuthStore();
	if (to.meta.requiresAuth && !auth.accessToken) {
		return { name: 'login', query: { redirect: to.fullPath } };
	}
	return true;
});

export default router;
