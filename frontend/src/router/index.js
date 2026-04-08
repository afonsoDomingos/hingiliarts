import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../App.vue';
import Dashboard from '../views/admin/Dashboard.vue'; // Importação estática direta

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
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/auctions',
        name: 'auctions',
        component: () => import('../views/Auctions.vue')
    },
    {
        path: '/auctions/:id',
        name: 'auction-detail',
        component: () => import('../views/AuctionDetail.vue')
    },
    {
        path: '/auctions/submit',
        name: 'auction-submit',
        component: () => import('../views/AuctionSubmit.vue')
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

// Recuperação automática de falhas de carregamento de módulos (acontece após novos deploys)
router.onError((error, to) => {
    if (error.message.includes('Failed to fetch dynamically imported module') || 
        error.message.includes('Importing a module script failed')) {
        window.location.href = to.fullPath;
    }
});

export default router;
