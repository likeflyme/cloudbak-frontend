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

export const randomString = (length) => {
    let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i)
        result += str[Math.floor(Math.random() * str.length)];
    return result;
}

// 验证字符串是否是邮箱格式
export const isEmail = (str) => {
    // 正则表达式，用来匹配邮箱格式
    let reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // 使用正则表达式的 test 方法来检查字符串是否符合邮箱格式
    return reg.test(str);
}

export const isAlphanumeric = (str) => {
    // 正则表达式，用来匹配字母、数字、下划线的格式
    var reg = /^\w+$/;
    // 使用正则表达式的 test 方法来检查字符串是否符合该格式
    return reg.test(str);
}

export const validPassword = (str) => {
    // 正则表达式，用来匹配包含字母、数字、特殊符号的字符串
    var reg = /^(?=.*[a-zA-Z])(?=.*\d)|(?=.*[a-zA-Z])(?=.*[\W_])|(?=.*\d)(?=.*[\W_]).+$/;
    // 使用正则表达式的 test 方法来检查字符串是否符合该条件
    return reg.test(str);
  }