import service from "../utils/request";

export const userProfile = () => {
    return service.get("/api/users/me")
};

export const updatePassword = (data) => {
    return service.put("/api/users/updatePassword", data)
};

export const userList = () => {
    return service.get("/api/users/")
};
export const userAdd = (data) => {
    return service.post("/api/users/", data)
};
export const userUpdate = (data) => {
    return service.put("/api/users/", data)
};
export const disableOrEnable = (uid) => {
    return service.put("/api/users/disableOrEnable?uid=" + uid)
};
export const isEmailRegisted = (email) => {
    return service.get("/api/users/isEmailRegisted?email=" + email)
};
export const isUsernameRegisted = (username) => {
    return service.get("/api/users/isUsernameRegisted?username=" + username)
};
export const register = (data) => {
    return service.post("/api/users/register", data)
};
// 重新发送激活码
export const resendActiveCode = () => {
    return service.post("/api/users/resendActiveCode")
};
// 发送邮箱验证码
export const sendActiveCode = (email) => {
    return service.get("/api/users/sendActiveCode?email="+email)
};
// 邮箱激活
export const emailActive = (code) => {
    return service.put("/api/users/emailActive?code=" + code)
};
// 订阅
export const subscribe = () => {
    return service.get("/api/users/subscribe")
};
// 取消订阅
export const cancelling = (subscription_id) => {
    return service.delete("/api/users/subscribe?subscription_id=" + subscription_id, {timeout: 20000})
};
// 重新订阅
export const resuming = (subscription_id) => {
    return service.patch("/api/users/subscribe?subscription_id=" + subscription_id, {timeout: 20000})
};
