export const getDomain = (url) => {
    let domain = url.split('/');
    if (domain[2]) {
        domain = domain[2];
    } else {
        domain = '';
    }
    return domain;
};

export const isLogin = () => {
    return !!token();
};

export const token = () => {
    return localStorage.getItem("token");
};

export const loginSuccess = (resp) => {
    let token = resp.token_type + " " + resp.access_token;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(resp));
    // 设置 cookies token 用于 home 页数据共享
    let home_host = import.meta.env.VITE_HOME_HOST;
    document.cookie = "token=" + token + ";domain=" + home_host + "; path=/;";
    document.cookie = "username=" + resp.username + ";domain=" + home_host + "; path=/;";
}

export const loginUser = () => {
    let user = localStorage.getItem("user");
    if (user) {
        return JSON.parse(user);
    }
}

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const lengthOfCharts = (str) => {
    let m = 0;
    let a = str.split("");
    for (let i = 0; i < a.length; i++) {
        if (a[i].charCodeAt(0) < 299) {
            m++;
        } else {
            m += 2;
        }
    }
    return m;
}

// 缩略字符串，一个中文按照两位计算，英文一位
export const shortenCharts = (str, max, suffix) => {
    let m = 0, str_return = '';
    let a = str.split("");
    for (let i = 0; i < a.length; i++) {
        if (a[i].charCodeAt(0) < 299) {
            m++;
        } else {
            m += 2;
        }
        if (m > max) {
            if (suffix)
                str_return += suffix;
            break;
        }
        str_return += a[i];
    }
    return str_return;
}

// 根据微信号获取用户信息
export const getUserByWxId = (store, name) => {
    return store.getters.getMappedContact[name];
}

// 根据微信号获取用户备注或昵称
export const getUserNameByWxId = (store, wxId) => {
    let user = getUserByWxId(store, wxId);
    if (user) {
        if (user.Remark){
            return user.Remark;
        } else {
            return user.NickName;
        }
    } else {
        return '未知用户'
    }
}

const chatType = (wxid) => {
    if (wxid.includes('@')) {
        return 0;
    } else {
        return 1;
    }
}

export const isChatRoom = (wxid) => {
    return chatType(wxid) === 0;
}

export const parseXml = (xmlString) => {
    const parser = new DOMParser();
    return parser.parseFromString(xmlString, 'application/xml');
};

export const getReferFileName = (content) => {
    let dom = parseXml(content);
    let title = dom.getElementsByTagName('title')[0]
    return title.textContent
}

export const getThumbFromStringContent = (content) => {
    let dom = parseXml(content);
    const emoji = dom.querySelector('emoji');
    if (emoji) {
        return emoji.getAttribute('cdnurl');
    }
    return '';
}

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export const validateUsername = (username) => {
    const re = /^[a-zA-Z0-9_]+$/;
    return re.test(username);
}


export const validatePassword = (password) => {
    if (password.length < 6) {
        return false; // 密码长度不足
    }

    const hasNumber = /[0-9]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // 检查是否至少包含两种字符类型
    const typesCount = [hasNumber, hasLetter, hasSpecialChar].filter(Boolean).length;

    return typesCount >= 2;
}
