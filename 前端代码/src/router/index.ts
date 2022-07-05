import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RouteView from '../views/RouteView.vue'
import AdminView from '../views/AdminView.vue'
import SearchView from '../views/SearchView.vue'
import SpaceView from '../views/SpaceView.vue'

const router = createRouter({
    // history: createWebHashHistory(),
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: HomeView
        }, {
            path: '/search/:input',
            component: SearchView,
        }, {
            path: '/search',
            component: SearchView,
        },

        {
            path: '/route/:id',
            component: RouteView
        },
        {
            path: '/admin',
            component: AdminView
        },{
            path: '/space',
            component: SpaceView
        }
    ]
})

export default router
