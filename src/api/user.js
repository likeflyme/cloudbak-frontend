import service from "../utils/request";

export const sysSessions = () => {
    return service.get("/api/user/sys-sessions")
};

export const updateCurrentSession = (sessionId) => {
    return service.put(`/api/user/set-current-session-id?sys_session_id=${sessionId}`)
}
