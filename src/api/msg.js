import service from "../utils/request";

export const session = (strUsrName) => {
    return service.get("/api/msg/session?strUsrName=" + strUsrName);
};

export const sessions = (page, size) => {
    return service.get(`/api/msg/sessions?page=${page}&size=${size}`);
};

export const msgBySvrId = (svrId, DbNo) => {
    return service.get(`/api/msg/msg_by_svr_id?svr_id=${svrId}&db_no=${DbNo}`);
};

export const msgs = (query) => {
    return service.get(`/api/msg/msgs?strUsrName=${query.strUsrName}&page=${query.page}&size=${query.size}&start=${query.start}&dbNo=${query.dbNo}&filterType=${query.filterType}&filterText=${query.filterText}&filterDay=${query.filterDay}&filterUser=${query.filterUser}`);
};

export const msgsFilter = (query) => {
    return service.get(`/api/msg/msgs-filter?strUsrName=${query.strUsrName}&page=${query.page}&size=${query.size}&start=${query.start}&dbNo=${query.dbNo}&filterType=${query.filterType}&filterText=${query.filterText}&filterDay=${query.filterDay}&filterUser=${query.filterUser}&filterMode=${query.filterMode}`);
};

export const msgsByLocalId = (query) => {
    return service.get(`/api/msg/msgs-by-local-id?strUsrName=${query.strUsrName}&page=${query.page}&size=${query.size}&start=${query.start}&dbNo=${query.dbNo}&localId=${query.localId}&CreateTime=${query.CreateTime}&Sequence=${query.Sequence}&filterMode=${query.filterMode}`);
};

export const contact = () => {
    return service.get('/api/msg/contact');
};

export const contactSplit = (page, size, search, ChatRoomType=0) => {
    return service.get(`/api/msg/contact-split?page=${page}&size=${size}&ChatRoomType=${ChatRoomType}&search=${search}`);
};

export const contactSearch = (search) => {
    return service.get(`/api/msg/contact-search?search=${search}`);
};

export const chatroom = (chatroomName) => {
    return service.get(`/api/msg/chatroom?chat_room_name=${chatroomName}`);
};

export const chatroomInfo = (chatroomName) => {
    return service.get(`/api/msg/chatroom-info?chat_room_name=${chatroomName}`);
};

export const headImage = (usrName) => {
    return service.get("/api/msg/head-image?usrName=" + usrName);
};

