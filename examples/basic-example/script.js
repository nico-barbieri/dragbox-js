import DragboxJS from "../../src/dragbox.js";

const options = {
    logging: ['dragbox-creating', 'dragbox-dragstart'],
    dragging: {
        free: false,
    },
    dragbox: {
        colorMethod: "shade",
    }
}

const Dragbox = new DragboxJS("dragboxjs-container", "dragbox-template", options);

Dragbox.init();