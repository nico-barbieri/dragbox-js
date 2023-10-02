import { cssRgbToHsl, deepMerge, calculateDepth, findParentWithClass } from "./js/utils.js";


/** 
 * cssRgbToHsl => given an rgb string, it returns a css ready hsl string
 * deepMerge => function to deep merge objects
 * calculateDepth => calculate the relative depth of an element with a class (given a nested structure with divs with that class)
 * findParentWithClass => return the first parent with a specific class
 */


//settings
let defaultOptions = {
    dragging: {
        free: true,
    },
    dragbox: {
        primaryColor: "rgb(25, 123, 210)",
        secondaryColor: "rgb(0, 240, 192)",
        colorMethod: "alternate", //alternate / shade
    }
}

let settings = {
    
}

let dragboxContainer = document.getElementById("dragbox-container");
let dragboxTemplate = document.getElementById('dragbox-template');
let dropzoneID = 0;
let dragboxID = 0;

const dragboxCreatedEvent = new Event('dragboxCreated');

let draggedboxStore = {
    draggedboxID: "",
    draggedboxSize: {w: 0, h: 0},
}

const colorDragbox = dragbox => {
    if (settings.dragbox.colorMethod == "alternate") {
        dragbox.style.background = dragbox.getAttribute('data-dragboxdepth') % 2 === 0 ? settings.dragbox.color1 : settings.dragbox.color2;
    } else if (settings.dragbox.colorMethod == "shade") {
        const lightness = (dragbox.getAttribute('data-dragboxdepth') / 10) * 100; 
        const hslColor = cssRgbToHsl(settings.dragbox.color1);
        dragbox.style.background = `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l + lightness}%)`;
    }
}

const updateDragboxes = () => {
    const dragboxes = document.querySelectorAll('.dragbox');
    
    dragboxes.forEach((dragbox) => {
        const depth = calculateDepth(dragbox, 'dragbox');
        dragbox.setAttribute('data-dragboxdepth', depth);
        colorDragbox(dragbox);
    });
}

const createDragbox = (lastDragboxID, depth) => {
    const dragbox = dragboxTemplate.cloneNode(true);
    dragbox.id = `dragbox-${lastDragboxID}`;
    dragboxID++;
    dragbox.style.display = '';
    dragbox.classList.add('dragbox');
    dragbox.setAttribute('data-dragboxdepth', (depth + 1));
    dragbox.setAttribute('draggable', true);

    
    dragbox.appendChild(createDropzone(dropzoneID));

    dragbox.addEventListener('dragstart', event => {
        //event.stopPropagation();

        console.log("Moving " + event.target.id + "...");
        const draggedbox = event.target;
        let offsetX = event.clientX;
        let offsetY = event.clientY;
        
        draggedbox.classList.add('dragging');

        draggedbox.querySelectorAll("*").forEach((draggedboxChild) => {
            draggedboxChild.style.pointerEvents = "none";
        });

        /* draggedbox.style.position = 'absolute';
        draggedbox.initialMousePosition = { x: offsetX, y: offsetY };
        event.dataTransfer.setDragImage(new Image(), 0, 0); */

        const draggedboxInfo = {
            draggedboxID: event.target.id,
            draggedboxSize: {w: event.target.offsetWidth, h: event.target.offsetHeight}
        };

        draggedboxStore = deepMerge({}, draggedboxStore, draggedboxInfo);

    })

    dragbox.addEventListener('drag', event => {

        const draggedbox = event.target;
        
        if (draggedbox.initialMousePosition) {
            const offsetX = event.clientX - draggedbox.initialMousePosition.x;
            const offsetY = event.clientY - draggedbox.initialMousePosition.y;
            
            draggedbox.style.left = `${offsetX}px`;
            draggedbox.style.top = `${offsetY}px`;
        }
    });

    dragbox.addEventListener('dragend', event => {
        event.preventDefault();
        event.stopPropagation();
        const draggedbox = event.target;

        draggedbox.classList.remove('dragging');
        draggedbox.style.position = settings.dragbox.position;
        draggedbox.querySelectorAll("*").forEach((draggedboxChild) => {
            draggedboxChild.style.pointerEvents = "all";
        });

        delete draggedbox.initialMouseOffset;

        draggedbox.style.left = ``;
        draggedbox.style.top = ``;
    });

    dragbox
    return dragbox;
}

const createDropzone = (lastDropzoneID) => {
    const dropzone = document.createElement('div');
    dropzone.classList.add('dropzone');
    dropzone.id = `dropzone-${lastDropzoneID}`;
    dropzoneID++;

    dropzone.addEventListener('dragover', event => {
        event.preventDefault();
        event.stopPropagation();

        // const draggingOnPlaceholder = event.target.closest('.dragbox-placeholder') != null;

        // console.log(draggedboxStore.draggedboxID + " passing over " + (draggingOnPlaceholder? "placeholder" : event.target.id) + "...");

        const placeholder = findParentWithClass(event.target, 'dragbox-placeholder');

        if (placeholder) {
            placeholder.style.minWidth = `${draggedboxStore.draggedboxSize.w}px`;
            placeholder.style.minHeight = `${draggedboxStore.draggedboxSize.h}px`;
        }
    })

    dropzone.addEventListener('dragleave', (event) => { 
        event.preventDefault();
        event.stopPropagation();  

        const placeholder = event.target.closest(".dragbox-placeholder");

        if (placeholder) {
            placeholder.style.minHeight = '';
            placeholder.style.minWidth = '';
        }
    });

    dropzone.addEventListener('drop', event => {
        event.stopPropagation();

        try {
            dropzone.lastChild.insertAdjacentElement('beforebegin', document.getElementById(draggedboxStore.draggedboxID))     
        } catch (error) {
            console.warn('Cannot move dragbox in this position.')
        }

        const placeholder = event.target.closest(".dragbox-placeholder");

        if (placeholder) {
            placeholder.style.minHeight = '';
            placeholder.style.minWidth = '';
        }
        
        dragboxUpdate();
    })


    return dropzone;
}

const handleNewDragbox = event => {
    const dropzone = event.target.closest('.dropzone');
    let dragboxdepth = event.target.closest('.dragbox')?.getAttribute('data-dragboxdepth');

    dragboxdepth = dragboxdepth ? parseInt(dragboxdepth) : 0;

    if (!dropzone) return;

    console.log(`Adding box in ${dropzone.id}...`);

    const newDragbox = createDragbox(dragboxID, dragboxdepth);
    const populatedDropzone = createDropzone(dropzoneID).appendChild(newDragbox);
    dropzone.insertBefore(populatedDropzone, dropzone.childNodes[dropzone.childElementCount - 1]);

    newDragbox.dispatchEvent(dragboxCreatedEvent);
    dragboxUpdate();
}

const createBoxPlaceholder = (dropzone) => {
    if (dropzone.querySelector(".dragbox-placeholder")) return

    const placeholder = document.createElement('div');
    placeholder.classList.add('dragbox-placeholder')

    const button = document.createElement('button');
    button.textContent = '+';
    button.classList.add('dragbox-add');
    button.addEventListener('click', handleNewDragbox);

    placeholder.appendChild(button);
    dropzone.appendChild(placeholder);
}

const setParams = (type, element) => {
    for (const key in settings[type]) {
        element.style[key]= settings[type][key];
    }
}

const initSettings = (options) => {
    /* settings['dropzone'] = {
        position: options?.dragging.free ? "absolute" : "relative",
    }; */

    settings['dragbox'] = {
        position: options?.dragging.free ? "absolute" : "relative",
        colorMethod: options?.dragbox?.colorMethod,
        color1: options?.dragbox?.primaryColor,
        color2: options?.dragbox?.secondaryColor,
    }
}

const dragboxUpdate = () => {
    const dropzones = dragboxContainer.querySelectorAll(".dropzone");

    dropzones.forEach(dropzone=>{
        //setParams("dropzone", dropzone);

        const hasBox = dropzone.querySelector(".dragbox");

        if (!hasBox) {
            dropzone.classList.add('empty');
            createBoxPlaceholder(dropzone);
        } else {
            dropzone.classList.remove('empty')
        }
    });

    updateDragboxes();
}

const dragboxInit = () => {
    const hasDropzone = dragboxContainer.querySelector('.dropzone') !== null;

    if (!hasDropzone) {
        dragboxContainer.appendChild(createDropzone(dropzoneID));
    }

    dragboxUpdate();
}

const dragboxStart = (options) => {
    if (!dragboxContainer) {
        throw new Error('Element with id "ddragbox-container" not found. Create a dragbox container by creating a div element with id "dragbox-container".');
    }

    if (!dragboxTemplate) {
        throw new Error('Template element with id "dragbox-template" not found. Create a dragbox template by creating a div element with id "dragbox-template".');
    }
    dragboxTemplate.style.display = "none";

    initSettings(deepMerge({}, defaultOptions, options));
    dragboxInit();

    /* todo: multiple containers
    dragboxContainers.forEach(dragboxContainer => dragboxInit(dragboxContainer)); 
    */
}


//since i'm testing the library on a index.html, just for development purpose, I'm setting some option and then call start

const options = {
    dragging: {
        free: false,
    },
    dragbox: {
        colorMethod: "shade",
    }
}

dragboxStart(options);