// src/plugins/popup-plugin.js
import { reactive, h, createVNode } from 'vue';

let popupCount = 0; // 记录打开的窗口数量

const popupState = reactive({
    windows: []
});

export default {
    install(app) {
        app.config.globalProperties.$popup = {
            open(Component, props = {}, options = {}) {
                console.log("open popup");
                popupCount++;

                // 设置窗口的默认配置
                const { width = '400px', height = '300px' } = options;

                const id = `popup-${popupCount}`;
                const popupProps = {
                    id,
                    component: Component,
                    props,
                    width,
                    height,
                };

                // 计算居中位置
                const left = (window.innerWidth - parseInt(width)) / 2 + 'px';
                const top = (window.innerHeight - parseInt(height)) / 2 + 'px';

                // 向窗口数组中添加一个新窗口
                popupState.windows.push({
                    id,
                    Component,
                    props,
                    width,
                    height,
                    left,
                    top
                });

                return id;
            },
            close(id) {
                const index = popupState.windows.findIndex(win => win.id === id);
                if (index !== -1) {
                    popupState.windows.splice(index, 1);
                }
            }
        };

        app.component('PopupWindow', {
            props: {
                id: String,
                component: Object,
                props: Object,
                width: String,
                height: String,
                left: String,
                top: String
            },
            setup(props) {
                return () =>
                    h(
                        'div',
                        {
                            class: 'popup-window',
                            style: {
                                position: 'fixed',
                                width: props.width,
                                height: props.height,
                                top: 0,
                                left: 0,
                                background: 'white',
                                border: '1px solid #ccc',
                                zIndex: 10000 + popupCount,
                                borderRadius: '8px',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                            }
                        },
                        [
                            h(props.component, props.props),
                            h('button', {
                                class: 'popup-close-btn',
                                onClick: () => {
                                    this.$popup.close(props.id);
                                }
                            }, 'Close')
                        ]
                    );
            }
        });

        app.provide('popupState', popupState); // 将popupState提供给全局
    }
};