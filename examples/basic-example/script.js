import { dragboxStart } from "../../src/core.js";

const options = {
    dragging: {
        free: false,
    },
    dragbox: {
        colorMethod: "shade",
    }
}

dragboxStart(options);