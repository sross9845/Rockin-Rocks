import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Checkout from '../views/Checkout.vue'
import Success from '../views/Success.vue'
import History from '../views/History.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: Checkout
  },
  {
    path: '/success',
    name: 'success',
    component: Success
  },
  {
    path: '/history',
    name: 'history',
    component: History
  }


]

const router = new VueRouter({
  routes
})

export default router
