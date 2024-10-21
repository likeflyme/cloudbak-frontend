import service from "../utils/request";


export const allConf = () => {
    return service.get("/api/conf/all-conf");
};

export const updateConf = (conf_key, conf_value) => {
    let data = {
        "conf_key": conf_key,
        "conf_value": conf_value
    }
    return service.post("/api/conf/update-conf", data);
};

