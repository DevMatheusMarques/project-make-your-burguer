import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import Home from "@/views/Home.vue";
import Pedidos from "@/views/Pedidos.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/pedidos',
    name: 'pedidos',
    component: Pedidos
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
