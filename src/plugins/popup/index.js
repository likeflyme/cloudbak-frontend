// src/plugins/popup-plugin.js
import {createVNode, reactive, render} from 'vue';
import Popup from "./Popup.vue";

let popupCount = 0; // 记录打开过的窗口数量

const popupState = reactive({
    windows: []
});
let prev = null;

export default {
    install(app) {

        app.config.globalProperties.$popup = {
            open(Component, props = {}, options = {}) {
                popupCount++;
                const slotVNode = createVNode(Component, props);

                // 设置窗口的默认配置
                const { width = '400px', height = '300px' } = options;

                options['top'] = (window.innerHeight - parseInt(height)) / 2 + 'px';
                options['left'] = (window.innerWidth - parseInt(width)) / 2 + 'px';
                options['id'] = `popup-${popupCount}`;
                options['zIndex'] = 1000 + popupCount;


                const windowVNode = createVNode(Popup, {
                    ...options, // 传递options中的所有参数
                    close: () => {
                        this.closeOnPopup(options['id']); // 调用插件中的关闭函数
                    }
                }, {
                    default: () => slotVNode  // 将 slotVNode 传递给默认插槽
                });
                windowVNode['id'] = options['id'];
                if (prev !== null) {
                    console.log('is same:', prev === windowVNode);
                }
                prev = windowVNode;
                console.log('createVNode', windowVNode);

                const container = document.createElement('div');
                container['id'] = options['id'];
                popupState.windows.push(container);
                document.body.appendChild(container);
                render(windowVNode, container);
                console.log('opened', popupState.windows)
            },
            closeOnPopup(id) {
                console.log("plugin close:", id);
                const index = popupState.windows.findIndex(win => win.id === id);
                if (index !== -1) {
                    const container = popupState.windows.splice(index, 1);
                    render(null, container);
                }
                console.log('closed', popupState.windows)
            }
        };



    }
};