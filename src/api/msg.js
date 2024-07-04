import service from "../utils/request";

export const sessions = () => {
    return service.get("/api/msg/sessions")
};
