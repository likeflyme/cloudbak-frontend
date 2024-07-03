import service from "../utils/request";

export const faviconAndTitle = (url) => {
    return service.get("/api/favicon/favicon_and_title?url=" + url)
};
