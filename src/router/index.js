import { createRouter, createWebHistory } from 'vue-router'
import UVView from '@/views/UVView.vue'
import AwarenessView from '@/views/AwarenessView.vue'
import ClothingView from '@/views/ClothingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: UVView },
    { path: '/awareness', component: AwarenessView },
    { path: '/clothing', component: ClothingView },
  ],
})

export default router
