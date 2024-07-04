import {createRouter, createWebHistory} from "vue-router";
import {isLogin} from '../utils/common';

const routes = [
    {
        path: '/',
        name: 'home',
        meta: {
            title: 'Home',
            loginRequire: true
        },
        component: () => import("../views/Home.vue"),
        children:[
            {
                path: 'comment',
                component: () => import("../views/MainComment.vue"),
            },
            {
                path: 'address-book',
                component: () => import("../views/MainAddressBook.vue"),
            },
            {
                path: 'collect',
                component: () => import("../views/MainCollect.vue"),
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login',
            loginRequire: false
        },
        component: () => import("../views/Login.vue"),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    // 需要登录且未登录，则重定向到 login 页
    if (to.matched.some(record => record.meta.loginRequire) && !isLogin()) {
        next({
            path: '/login',
        })
    } else {
        next();
    }
});

export default router
