import DragboxJS from "../../src/dragbox.js";

const options = {
    logging: 'all',
    dragging: {
        free: false,
    },
    dragbox: {
        colorMethod: "shade",
    },
    placeholder: {
        generation: 'auto',
    }
}

const Dragbox = new DragboxJS("dragboxjs-container", "dragbox-template", options);

Dragbox.init();