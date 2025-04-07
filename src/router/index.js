import { createRouter, createWebHistory } from 'vue-router'
import headNav from '../views/index.vue'
import sgpa from '@/views/components/sgpa.vue'
import cgpa from '@/views/components/cgpa.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path:'/',
    component:headNav,
    children:[
      {
        path:'',
        component:sgpa
      },
      {
        path:'cgpa',
        component:cgpa
      }
    ]
  }
    
  ],
})

export default router
