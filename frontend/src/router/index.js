import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../App.vue'; // This is a bit of a circular ref if we keep everything in App.vue, let's refactor App.vue later
// Actually, let's define the routes properly

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/LandingPage.vue')
    },
    {
        path: '/admin/login',
        name: 'admin-login',
        component: () => import('../views/admin/Login.vue')
    },
    {
        path: '/admin/dashboard',
        name: 'admin-dashboard',
        component: () => import('../views/admin/Dashboard.vue'),
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Guard de Autenticação
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('adminToken');
    if (to.meta.requiresAuth && !token) {
        next('/admin/login');
    } else {
        next();
    }
});

export default router;
