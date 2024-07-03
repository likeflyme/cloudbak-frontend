import {createStore} from 'vuex'
import dialogStore from "./dialogStore";

const state = {
    manage: false,
    stars: {
        id: -2,
        title: 'Favorite',
        children: []
    },
    menu: [],
    menumap: {},
    dialog: dialogStore,
    itemDialogVisible: false,
    addParent: -1,
    nodeAddOrEditTemp: {},
    menuForm: {
        id: -1,
        title: "",
        icon: "",
        order: -1
    },
    collapse:false,
    drawer: false,
    drawerGroup: {
        title: "",
        id: "",
        icon: "",
    },
    recognize: false,
    user: {
        username: 'name',
        nickname: 'name',
        avatar: '',
        role: 1, // 角色，0为超级用户，1为普通用户
        email_verified_at: '2023-05-16'
    },
    sub: 'no_active',
    subscription: {
        id: null,
        subscription_id: null,
        status: null
    },
    shareAddOrEdit: {id: ''},
    shareUpdated: 0,
    nodeLimit: 100,
    nodePlusLimit: 2000,
    nodeCount: 0,
    indexMenu: 'Feature',
    sharesCount: 0,
    sharesLimit: 3,
    sharesPlusLimit: 100,
}

const mutations = {

}

const getters = {
    isManage(state) {
        return state.manage;
    },
    loginUser(state) {
        return state.user;
    }
}

// 创建一个新的 store 实例
const store = createStore({
    state,
    mutations,
    getters
});
export default store;
