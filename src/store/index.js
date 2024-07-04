import {createStore} from 'vuex'

const state = {
    sessions: []
}

const mutations = {
    setSessions (state, sessions) {
        state.sessions = sessions
    }
}

const getters = {
    getSessions (state) {
        return state.sessions;
    }
}

// 创建一个新的 store 实例
const store = createStore({
    state,
    mutations,
    getters
});
export default store;
