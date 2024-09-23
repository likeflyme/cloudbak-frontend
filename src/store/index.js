import {createStore} from 'vuex'

const state = {
    sessions: [],
    mapSessions: {},
    userInfo: {
        current_session: {}
    },
    mappedContact: {},
    // 联系人页面用户详情
    addrShowUser: {},
    sysSessions: [],
    error: {
        show: false,
        msg: '错误消息',
        delay: 10000,
        tm: null
    },
    sysTool: {
        show: false
    }
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
    },
    setSysSessions (state, sysSessions) {
        state.sysSessions = sysSessions
    },
    setCurrentSession(state, sysSession) {
        state.userInfo.current_session_id = sysSession.id;
        state.userInfo.current_session = sysSession;
    },
    dropSession(state, sysSessionId) {
        state.sysSessions = state.sysSessions.filter(session => session.id !== sysSessionId);
    },
    showErrorToastMsg(state, err) {
        state.error.msg = err.msg;
        state.error.show = true;
        let delay = state.error.delay;
        if (err.delay) {
            delay = err.delay;
        }
        // 先清除前一个延时处理任务
        if (state.error.tm) {
            clearTimeout(state.error.tm);
        }
        state.error.tm = setTimeout(function () {
            state.error.show = false;
        }, delay);
    },
    closeErrorToastMsg(state) {
        if (state.error.tm) {
            state.error.show = false;
            clearTimeout(state.error.tm);
            state.error.tm = null;
        }
    },
    openSysTool (state) {
        state.sysTool.show = true;
    },
    closeSysTool (state) {
        state.sysTool.show = false;
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
        return '/head/' + state.userInfo.current_session.id + '/';
    },
    getCurrentWxId(state) {
        return state.userInfo.current_session.wx_id;
    },
    getCurrentSessionName(state) {
        return state.userInfo.current_session.name;
    },
    getCurrentSessionId(state) {
        return state.userInfo.current_session_id;
    },
    getCurrentSession(state) {
        return state.userInfo.current_session;
    },
    getCurrentWxHeadImgPath(state) {
        return getters.getHeadImgPath(state) + getters.getCurrentWxId(state) + '.jpg'
    },
    getMappedContact(state) {
        return state.mappedContact;
    },
    getAddrShowUser(state) {
        return state.addrShowUser;
    },
    getSysSessions(state) {
        return state.sysSessions;
    },
    isShowToastMsg(state) {
        return state.error.show;
    },
    getToastMsg(state) {
        return state.error.msg;
    },
    isShowSysTools(state) {
        return state.sysTool.show;
    }
}

// 创建一个新的 store 实例
const store = createStore({
    state,
    mutations,
    getters
});
export default store;
