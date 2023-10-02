// Import utility functions from utils.js

import { cssRgbToHsl, deepMerge, calculateDepth, findParentWithClass } from "./utils.js";

// Define default options and an empty settings object in which will be stored settings based on user's option
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

let settings = {}

// Get references to important elements and initialize IDs

let dragboxContainer = document.getElementById('dragbox-container');
let dragboxTemplate = document.getElementById('dragbox-template');
let dropzoneID = 0;
let dragboxID = 0;

// Create a custom event for dragbox creation
const dragboxCreatedEvent = new Event('dragboxCreated');

// Create an object to store dragged box information
let draggedboxStore = {
    draggedboxID: "",
    draggedboxSize: {w: 0, h: 0},
}

/**
 * Define colorDragbox function to calculate dragbox color based on settings and depth.
 * @param {HTMLElement} dragbox The element to stylize.
 */
const colorDragbox = dragbox => {
    if (settings.dragbox.colorMethod == "alternate") {
        dragbox.style.background = dragbox.getAttribute('data-dragboxdepth') % 2 === 0 ? settings.dragbox.color1 : settings.dragbox.color2;
    } else if (settings.dragbox.colorMethod == "shade") {
        const lightness = (dragbox.getAttribute('data-dragboxdepth') / 10) * 100; 
        const hslColor = cssRgbToHsl(settings.dragbox.color1);
        dragbox.style.background = `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l + lightness}%)`;
    }
}

/**
 * Function to update all dragboxes depth and color.
 */
const updateDragboxes = () => {
    const dragboxes = document.querySelectorAll('.dragbox');
    
    dragboxes.forEach((dragbox) => {
        const depth = calculateDepth(dragbox, 'dragbox');
        dragbox.setAttribute('data-dragboxdepth', depth);
        colorDragbox(dragbox);
    });
}

/**
 * Function to create a new dragbox.
 * @param {Number} lastDragboxID Most recent ID used for dragbox.
 * @param {Number} depth Depth of the element in which the dragbox is created (returned dragbox will have data-dragboxdepth = depth+1).
 * @returns an HTMLElement: the dragbox created.
 */
const createDragbox = (lastDragboxID, depth) => {
    // Create a new dragbox based on template
    const dragbox = dragboxTemplate.cloneNode(true);
    // Assign a new id and update the id
    dragbox.id = `dragbox-${lastDragboxID}`;
    dragboxID++;
    // Reset display style inherited from template
    dragbox.style.display = '';
    // Add the dragbox class and other attributes
    dragbox.classList.add('dragbox');
    dragbox.setAttribute('data-dragboxdepth', (depth + 1));
    dragbox.setAttribute('draggable', true);

    // Create a new dropzone inside the new dragbox
    dragbox.appendChild(createDropzone(dropzoneID));

    // Adding the event listeners [TODO: Use single listeners on dragboxjs-container]
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

    return dragbox;
}

/**
 * Function to create a new dropzone.
 * @param {Number} lastDropzoneID Most recent ID used for dropzone.
 * @returns an HTMLElement: the dropzone created.
 */
const createDropzone = (lastDropzoneID) => {
    // Create the element, assing class and id and update id [TODO: better ids management with proper functions in a new DragboxJS class]
    const dropzone = document.createElement('div');
    dropzone.classList.add('dropzone');
    dropzone.id = `dropzone-${lastDropzoneID}`;
    dropzoneID++;

    // Add event listeners [TODO: Use single listeners on dragboxjs-container]
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

/**
 * Function to handle the creation of a new dragbox on click.
 * @param {Event} event Event which triggers the function.
 * @returns 
 */
const handleNewDragbox = event => {
    // get the closest dropzone and the closest dragbox's depth
    const dropzone = event.target.closest('.dropzone');
    let dragboxdepth = event.target.closest('.dragbox')?.getAttribute('data-dragboxdepth');

    // set depth to 0 if dragboxdepth is undefined
    dragboxdepth = dragboxdepth ? parseInt(dragboxdepth) : 0;

    // check if dropzone exists
    if (!dropzone) return;

    // logging [TODO: logging based on settings]
    console.log(`Adding box in ${dropzone.id}...`);

    // create a new dragbox
    const newDragbox = createDragbox(dragboxID, dragboxdepth);

    /* // create a new dropzone to contain the new dragbox
    const populatedDropzone = createDropzone(dropzoneID).appendChild(newDragbox); */

    // insert the new dragbox before the "placeholder" element which creates dragboxes on click
    dropzone.insertBefore(newDragbox, dropzone.childNodes[dropzone.childElementCount - 1]);

    // dispatch a dragboxCreated event to link other possible functions
    newDragbox.dispatchEvent(dragboxCreatedEvent);

    // update DragboxJS
    dragboxUpdate();
}

/**
 * Function to create a dragboxPlaceholder.
 * @param {HTMLElement} dropzone The HTML element in which the placeholder will be created.
 * @returns 
 */
const createBoxPlaceholder = (dropzone) => {
    // check if a placeholder is already present
    if (dropzone.querySelector(".dragbox-placeholder")) return

    // create placeholder and its button
    const placeholder = document.createElement('div');
    placeholder.classList.add('dragbox-placeholder')

    const button = document.createElement('button');
    button.textContent = '+';
    button.classList.add('dragbox-add');
    button.addEventListener('click', handleNewDragbox);

    placeholder.appendChild(button);
    dropzone.appendChild(placeholder);
}

/**
 * Set css parameters for an element based on settings and element.
 * @param {String} type Type of element (dragbox, dropzone...).
 * @param {HTMLElement} element Element to style.
 */
const setParams = (type, element) => {
    for (const key in settings[type]) {
        element.style[key]= settings[type][key];
    }
}

/**
 * Initialize settings based on options.
 * @param {Object} options Configuration object.
 */
const initSettings = (options) => {
    settings['dragbox'] = {
        position: options?.dragging.free ? "absolute" : "relative",
        colorMethod: options?.dragbox?.colorMethod,
        color1: options?.dragbox?.primaryColor,
        color2: options?.dragbox?.secondaryColor,
    }
}

/**
 * Function to update DragboxJS
 */
const dragboxUpdate = () => {
    // Get all dropzones
    const dropzones = dragboxContainer.querySelectorAll(".dropzone");

    // Check if any dropzone is empty
    dropzones.forEach(dropzone=>{
        //setParams("dropzone", dropzone);

        const hasBox = dropzone.querySelector(".dragbox");

        if (!hasBox) {
            dropzone.classList.add('empty');
            // create placeholder for empty dropzones
            createBoxPlaceholder(dropzone);
        } else {
            dropzone.classList.remove('empty')
        }
    });

    // Update all dragboxes with the updateDragboxes function.
    updateDragboxes();
}

/**
 * Function to initialize DragboxJS.
 */
const dragboxInit = () => {
    //Check if there's any dropzone, then create it and update
    const hasDropzone = dragboxContainer.querySelector('.dropzone') !== null;

    if (!hasDropzone) {
        dragboxContainer.appendChild(createDropzone(dropzoneID));
    }

    dragboxUpdate();
}

/**
 * Function to start DragboxJS.
 * @param {Object} options Configuration object.
 */
export const dragboxStart = (options) => {
    // check if dragboxcontainer or dragboxtemplate is missing

    if (!dragboxContainer) {
        throw new Error('Element with id "ddragbox-container" not found. Create a dragbox container by creating a div element with id "dragbox-container".');
    }

    if (!dragboxTemplate) {
        throw new Error('Template element with id "dragbox-template" not found. Create a dragbox template by creating a div element with id "dragbox-template".');
    }

    // hide dragbox-template
    dragboxTemplate.style.display = "none";

    // initialize settings and start DragboxJS
    initSettings(deepMerge({}, defaultOptions, options));
    dragboxInit();

    /* todo: multiple containers
    dragboxContainers.forEach(dragboxContainer => dragboxInit(dragboxContainer)); 
    */
}

