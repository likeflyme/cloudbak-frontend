import service from "../utils/request";

export const shareList = () => {
    return service.get("/api/share/")
};
export const shareNodeIdList = (sid) => {
    return service.get("/api/share/sharesNodesId/" + sid)
};
export const addShare = (data) => {
    return service.post("/api/share/", data)
};
export const updateShare = (data) => {
    return service.put("/api/share/", data)
};
export const disableOrEnable = (id) => {
    return service.put("/api/share/disableOrEnable/" + id)
};
export const getShareData = (hash) => {
    return service.get("/api/share/commonShare/" + hash)
};
export const validateSharePassword = (hash, password) => {
    return service.get("/api/share/validatePassword/" + hash + "?password=" + password)
};
