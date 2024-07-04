import {createStore} from 'vuex'

const state = {
    sessions: [],
    userInfo: {
        current_session: {}
    }
}

const mutations = {
    setSessions (state, sessions) {
        state.sessions = sessions
    },
    setUserInfo (state, userInfo) {
        state.userInfo = userInfo;
    }
}

const getters = {
    getSessions (state) {
        return state.sessions;
    },
    getUserInfo (state) {
        return state.userInfo;
    },
    getHeadImgPath(state) {
        return '/head/' + state.userInfo.current_session.name + '/' + state.userInfo.current_session.wx_id + '/';
    }
}

// 创建一个新的 store 实例
const store = createStore({
    state,
    mutations,
    getters
});
export default store;
