const msgType = {
    '1.0': '文本',
    '3.0': '图片',
    '34.0': '语音',
    '43.0': '视频',
    '47.0': '动画表情',
    '48.0': '定位',
    // 类似文字消息而不一样的消息，目前只见到一个阿里云盘的邀请注册是这样的。估计和 57 子类的情况一样
    '49.1': '49.24 未知',
    // 公众号通知
    // compress_content.msg.appmsg.mmreader.category.@type 代表类别
    // 0: 通知
    // 20: 卡片式链接
    '49.5': '通知',
    // CompressContent 中有文件名和下载链接（但不会读），BytesExtra 中有本地保存的路径
    '49.6': '文件',
    // 用户上传的 GIF 表情，CompressContent 中有 CDN 链接，不过似乎不能直接访问下载
    '49.8': 'GIF',
    // 合并转发的聊天记录，CompressContent 中有详细聊天记录，BytesExtra 中有图片视频等的缓存
    '49.19': '聊天记录',
    '49.24': '49.24 未知',
    // 分享的小程序，CompressContent 中有卡片信息，BytesExtra 中有封面缓存位置
    '49.33': '分享小程序',
    // 带有引用的文本消息（这种类型下 StrContent 为空，发送和引用的内容均在 CompressContent 中）
    '49.57': '引用文本消息',
    // 视频号直播或直播回放等
    '49.63': '视频号直播或直播回放等',
    '49.87': '群公告',
    '49.88': '49.88 未知',
    '49.2000': '转账消息',
    '49.2003': '红包',
    '50.0': '语音或视频通话',
    '10000.0': '系统通知',
    '10000.4': '拍一拍',
    '10000.57': '撤回,重新编辑',
    '10000.8000': '系统通知（特别包含你邀请别人加入群聊）'
}

export const get_msg_desc = (tp, subtp) => {
    let desc = msgType[tp + '.' + subtp];
    if (desc) {
        return desc;
    } else {
        return tp + '.' + subtp + '未知';
    }
}