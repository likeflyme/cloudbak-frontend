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
                name: 'session',
                path: 'session/:sessionId/',
                component: () => import("../components/main/Main.vue"),
                children: [
                    {
                        name: 'address-book',
                        path: 'address-book',
                        component: () => import("../components/main/addressbook/AddressBook.vue"),
                        children: [
                            {
                                path: 'chat-room-info/:id',
                                component: () => import("../components/main/addressbook/info/ChatRoomInfo.vue"),
                            },
                            {
                                path: 'user-info/:id',
                                component: () => import("../components/main/addressbook/info/UserInfo.vue"),
                            }
                        ]
                    },
                    {
                        name: 'comment',
                        path: 'comment',
                        component: () => import("../components/main/comment/Comment.vue"),
                        children: [
                            {
                                name: "chat",
                                path: ':id',
                                component: () => import("../components/main/comment/CommentChat.vue"),
                            }
                        ]
                    },
                    {
                        name: 'collect',
                        path: 'collect',
                        component: () => import("../components/main/collect/Collect.vue"),
                    },
                    {
                        name: 'files',
                        path: 'files',
                        component: () => import("../components/main/files/Files.vue"),
                    },
                    {
                        name: 'community',
                        path: 'community',
                        component: () => import("../components/main/community/Community.vue"),
                    }
                ]
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
