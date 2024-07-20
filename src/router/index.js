import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Pedidos from "@/views/Pedidos.vue";
import Ingredientes from "@/views/Ingredientes.vue";
import Login from "@/views/Login.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true, roles: ['admin', 'waiter'] }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/pedidos',
    name: 'Pedidos',
    component: Pedidos,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/ingredientes',
    name: 'Ingredientes',
    component: Ingredientes,
    meta: { requiresAuth: true, roles: ['admin'] }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const user = JSON.parse(localStorage.getItem('user'));

  if (requiresAuth) {
    if (!user || !user.token) {
      next({ name: 'Login' });
    } else {
      const userRole = user.role;
      const allowedRoles = to.meta.roles;

      if (allowedRoles && allowedRoles.includes(userRole)) {
        next();
      } else {
        next({ name: 'Home' });
      }
    }
  } else {
    next();
  }
});

export default router;
