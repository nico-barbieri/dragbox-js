import DragboxJS from "../../src/dragbox.js";

const options = {
    logging: 'all',
    dragging: {
        free: false,
    },
    dragbox: {
        colorMethod: "shade",
        primaryColor: 'rgb(200,200,200)',
    },
    placeholder: {
        generation: 'none',
    }
}

const Dragbox = new DragboxJS("dragboxjs-container", "dragbox-template", options);

Dragbox.init();