import {createStore} from 'vuex'

const state = {
    sessions: [],
    userInfo: {
        current_session: {}
    },
    mappedContact: {},
    // 联系人页面用户详情
    addrShowUser: {}
}

const mutations = {
    setSessions (state, sessions) {
        state.sessions = sessions
    },
    setUserInfo (state, userInfo) {
        state.userInfo = userInfo;
    },
    setContact(state, contact) {
        for (let c of contact) {
            state.mappedContact[c.UserName] = c;
        }
    },
    setAddrShowUser (state, addrShowUser) {
        state.addrShowUser = addrShowUser;
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
    },
    getCurrentWxId(state) {
        return state.userInfo.current_session.wx_id;
    },
    getCurrentSessionName(state) {
        return state.userInfo.current_session.name;
    },
    getCurrentWxHeadImgPath(state) {
        return getters.getHeadImgPath(state) + getters.getCurrentWxId(state) + '.jpg'
    },
    getMappedContact(state) {
        return state.mappedContact;
    },
    getAddrShowUser(state) {
        return state.addrShowUser;
    }

}

// 创建一个新的 store 实例
const store = createStore({
    state,
    mutations,
    getters
});
export default store;
