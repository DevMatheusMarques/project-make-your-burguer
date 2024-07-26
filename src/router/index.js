import { createRouter, createWebHistory } from 'vue-router';
import Pedidos from "@/views/Pedidos.vue";
import Ingredientes from "@/views/Ingredientes.vue";
import Cardapio from "@/views/Cardapio.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import {jwtDecode} from "jwt-decode";
import Dashboard from "@/views/Dashboard.vue";
import Users from "@/views/Users.vue";

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/cardapio',
    name: 'Cardapio',
    component: Cardapio,
    meta: { requiresAuth: true, roles: ['admin', 'waiter'] }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, roles: ['admin'] }
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
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
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
      // Evita redirecionar para Login se já estiver na página de Login
      if (to.name !== 'Login') {
        next({ name: 'Login' });
      } else {
        next(); // Se já estiver na página de Login, apenas prossiga
      }
    } else {
      const userRole = jwtDecode(user.token).role;
      const allowedRoles = to.meta.roles || [];

      if (allowedRoles.includes(userRole)) {
        // Evita redirecionar para Home se já estiver na página Home
        if (to.name === 'Login') {
          next({ name: 'Dashboard' });
        } else {
          next(); // Usuário tem permissão, prossegue normalmente
        }
      } else {
        // Evita redirecionar para Home se já estiver na página Home
        if (to.name !== 'Dashboard') {
          next({ name: 'Dashboard' });
        } else {
          next(); // Se já estiver na página Home, apenas prossiga
        }
      }
    }
  } else {
    next(); // Página não requer autenticação, prossiga normalmente
  }
});

export default router;
