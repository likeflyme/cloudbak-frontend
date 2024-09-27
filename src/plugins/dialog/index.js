import { createApp, createVNode, render } from 'vue';
import Dialog from './Dialog.vue';

let dialogApp = null;

const createDialog = () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    return {
        open(options) {
            // 创建 Dialog 组件的 VNode
            const dialogVNode = createVNode(Dialog, {
                onConfirmed: options.onConfirmed,
                onCancelled: options.onCancelled,
            });

            // 将 VNode 渲染到 DOM 中
            render(dialogVNode, container);

            // 打开对话框
            dialogVNode.component.exposed.openDialog(options.title, options.desc);
        }
    };
};

const dialogPlugin = {
    install(app) {
        dialogApp = createDialog();
        app.config.globalProperties.$dialog = dialogApp;
    },
};

export default dialogPlugin;