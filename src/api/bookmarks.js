import service from "../utils/request";

export const selectBookmarks = () => {
    return service.get("/api/bm/bookmarks")
};
export const moveBookmark = (data) => {
    return service.put("/api/bm/move", data)
};
export const remove = (id) => {
    return service.delete("/api/bm/bookmark/" + id)
};
export const createBookmark = (data) => {
    return service.post("/api/bm/bookmark", data)
};
export const updateBookmark = (data) => {
    return service.put("/api/bm/bookmark", data)
};
export const startOrUnStar = (id) => {
    return service.put("/api/bm/starOrUnStar/" + id)
};
export const removeAll = () => {
    return service.delete("/api/bm/removeAll")
};
