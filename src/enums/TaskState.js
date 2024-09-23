import {createEnum} from "./Enum.js";

export const TaskState = createEnum({
    SUCCESS: [0, '成功'],
    FAILED: [1, '失败'],
    RUNNING: [2, '执行中']
});