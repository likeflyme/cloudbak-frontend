import service from "../utils/request";

export const sysSessions = () => {
    return service.get("/api/user/sys-sessions")
};

export const updateCurrentSession = (sessionId) => {
    return service.put(`/api/user/set-current-session-id?sys_session_id=${sessionId}`)
}

export const addSysSession = (data) => {
    return service.post("/api/user/sys-session", data)
};

export const checkInstall = () => {
    return service.get("/api/user/check-install")
};

export const createUser = (data) => {
    return service.post("/api/user/create-user", data)
};
export const deleteSession = (sys_session_id) => {
    return service.delete(`/api/user/sys-session/${sys_session_id}`)
};
