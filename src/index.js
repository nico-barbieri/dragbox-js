import { cssRgbToHsl, deepMerge, calculateDepth, findParentWithClass } from "./utils.js";

class DragboxJS {
    /**
     * Create a new DragboxJS instance.
     * @param {String} containerId The id of dragbox-container div.
     * @param {String} templateId The id of dragbox-template div.
     * @param {Object} options Configuration object for DragboxJS.
     */
    constructor(containerId, templateId, options = {}) {
        this.container = document.getElementById(containerId);
        this.template = document.getElementById(templateId);
        this.options = deepMerge({}, this.getDefaultOptions(), options);

        this.dragboxID = 0;
        this.dropzoneID = 0;
        this.draggedboxStore = {
            draggedboxID: "",
            draggedboxSize: { w: 0, h: 0 },
        };

        // Create a custom events
        this.dragboxCreatedEvent = new Event('dragboxCreated');
    }

    /**
     * Default options for DragboxJS.
     * @returns Default options for DragboxJS.
     */
    getDefaultOptions() {
        return {
            logging: "none", // none / all / ['dragbox-creating', 'dragbox-dragging', 'dragbox-draggingover', 'dragbox-dropping', ...]
            dragging: {
                free: false,
            },
            dragbox: {
                primaryColor: "rgb(25, 123, 210)",
                secondaryColor: "rgb(0, 240, 192)",
                colorMethod: "shade",  // shade / alternate
            },
        };
    }

    /**
     * Function to start DragboxJS.
     */
    init() {
        // check if dragboxcontainer or dragboxtemplate is missing
        if (!this.container) {
            throw new Error('Element with id "ddragbox-container" not found. Create a dragbox container by creating a div element with id "dragbox-container".');
        }

        if (!this.template) {
            throw new Error('Template element with id "dragbox-template" not found. Create a dragbox template by creating a div element with id "dragbox-template".');
        }

        // check if a dropzone is already present
        if (this.container.querySelector('.dropzone')) {
            throw new Error('DragboxJS container cannot have a dropzone before initialization.')
        }

        this.container.classList.add('dragboxjs-container')
        this.template.style.display = "none";
        this.container.appendChild(this.createDropzone());

        this.container.addEventListener('dragboxCreated', event => {
            console.log("Dragbox created: " + event.target);
        })
        this.update();
    }

    /**
     * Function to update DragboxJS
     */
    update() {
        // UPDATE DROPZONES
        const dropzones = this.container.querySelectorAll(".dropzone");

        // Check if any dropzone is empty
        dropzones.forEach(dropzone => {
            const hasBox = dropzone.querySelector(".dragbox");

            if (!hasBox) {
                dropzone.classList.add('empty');
                this.createBoxPlaceholder(dropzone);
            } else {
                dropzone.classList.remove('empty');
            }
        });

        // UPDATE DRAGBOXES
        const dragboxes = this.container.querySelectorAll('.dragbox');

        // update all dragboxes depth and color
        dragboxes.forEach((dragbox) => {
            const depth = calculateDepth(dragbox, 'dragbox');
            dragbox.setAttribute('data-dragboxdepth', depth);
            this.colorDragbox(dragbox);
        });
    }

    /**
     * Function to create a new dropzone.
     * @returns an HTMLElement: the dropzone created.
     */
    createDropzone() {
        // Create the element, assing class and updated id
        const dropzone = document.createElement('div');
        dropzone.classList.add('dropzone');
        dropzone.id = `dropzone-${this.dropzoneID++}`;

        // Add event listeners [TODO: Use single listeners on dragboxjs-container]
        dropzone.addEventListener('dragover', this.onDragOver.bind(this));
        dropzone.addEventListener('dragleave', this.onDragLeave.bind(this));
        dropzone.addEventListener('drop', this.onDrop.bind(this));

        return dropzone;
    }

    /**
     * Function to create a new dragbox.
     * @param {Number} depth Depth of the element in which the dragbox is created (returned dragbox will have data-dragboxdepth = depth+1).
     * @returns an HTMLElement: the dragbox created.
     */
    createDragbox(depth) {
        // Create a new dragbox based on template
        const dragbox = this.template.cloneNode(true);
        // Assign a new updated id
        dragbox.id = `dragbox-${this.dragboxID++}`;
        // Reset display style inherited from template
        dragbox.style.display = '';
         // Add the dragbox class and other attributes
        dragbox.classList.add('dragbox');
        dragbox.setAttribute('data-dragboxdepth', depth + 1);
        dragbox.setAttribute('draggable', true);

        // Adding the event listeners [TODO: Use single listeners on dragboxjs-container]
        dragbox.addEventListener('dragstart', this.onDragStart.bind(this));
        dragbox.addEventListener('drag', this.onDrag.bind(this));
        dragbox.addEventListener('dragend', this.onDragEnd.bind(this));

        // Create a new dropzone inside the new dragbox
        dragbox.appendChild(this.createDropzone());

        return dragbox;
    }

    onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();

        const placeholder = findParentWithClass(event.target, 'dragbox-placeholder');

        if (placeholder) {
            placeholder.style.minWidth = `${this.draggedboxStore.draggedboxSize.w}px`;
            placeholder.style.minHeight = `${this.draggedboxStore.draggedboxSize.h}px`;
        }
    }

    onDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();

        const placeholder = event.target.closest(".dragbox-placeholder");

        if (placeholder) {
            placeholder.style.minHeight = '';
            placeholder.style.minWidth = '';
        }
    }

    onDrop(event) {
        event.stopPropagation();
        let dropzone = event.target;

        // check if target is a dropzone, otherwise find first parent dropzone
        if (!event.target.classList.contains('dropzone')) {
            dropzone = findParentWithClass(event.target, "dropzone");
        }

        try {
            dropzone.lastChild.insertAdjacentElement('beforebegin', document.getElementById(this.draggedboxStore.draggedboxID));
        } catch (error) {
            console.warn('Cannot move dragbox in this position.');
        }

        const placeholder = event.target.closest(".dragbox-placeholder");

        if (placeholder) {
            placeholder.style.minHeight = '';
            placeholder.style.minWidth = '';
        }

        this.update();
    }

    onDragStart(event) {
        this.log(`Moving ${event.target.id}...`, "dragbox-dragstart");

        const draggedbox = event.target;

        event.dataTransfer.effectAllowed = '';

        draggedbox.classList.add('dragging');

        draggedbox.querySelectorAll("*").forEach(draggedboxChild => {
            draggedboxChild.style.pointerEvents = "none";
        });

        const draggedboxInfo = {
            draggedboxID: event.target.id,
            draggedboxSize: { w: event.target.offsetWidth, h: event.target.offsetHeight },
        };

        this.draggedboxStore = deepMerge({}, this.draggedboxStore, draggedboxInfo);
    }

    onDrag(event) {
        const draggedbox = event.target;

        if (draggedbox.initialMousePosition) {
            const offsetX = event.clientX - draggedbox.initialMousePosition.x;
            const offsetY = event.clientY - draggedbox.initialMousePosition.y;

            draggedbox.style.left = `${offsetX}px`;
            draggedbox.style.top = `${offsetY}px`;
        }
    }

    onDragEnd(event) {
        event.preventDefault();
        event.stopPropagation();
        const draggedbox = event.target;

        draggedbox.classList.remove('dragging');
        draggedbox.style.position = this.options.dragging.free? 'absolute' : 'relative';
        draggedbox.querySelectorAll("*").forEach(draggedboxChild => {
            draggedboxChild.style.pointerEvents = "all";
        });

        delete draggedbox.initialMouseOffset;

        draggedbox.style.left = ``;
        draggedbox.style.top = ``;
    }

    /**
     * Function to create a dragboxPlaceholder.
     * @param {HTMLElement} dropzone The HTML element in which the placeholder will be created.
     */
    createBoxPlaceholder(dropzone) {
        // check if a placeholder is already present
        if (dropzone.querySelector(".dragbox-placeholder")) return;

        // create placeholder and its button
        const placeholder = document.createElement('div');
        placeholder.classList.add('dragbox-placeholder');

        const button = document.createElement('button');
        button.textContent = '+';
        button.classList.add('dragbox-add');

        button.addEventListener('click', this.handleNewDragbox.bind(this));

        placeholder.appendChild(button);
        dropzone.appendChild(placeholder);
    }

    /**
     * Function to handle the creation of a new dragbox on click.
     * @param {Event} event Event which triggers the function.
     */
    handleNewDragbox(event) {
        // get the closest dropzone and the closest dragbox's depth
        const dropzone = event.target.closest('.dropzone');
        let dragboxdepth = event.target.closest('.dragbox')?.getAttribute('data-dragboxdepth');

        // set depth to 0 if dragboxdepth is undefined
        dragboxdepth = dragboxdepth ? parseInt(dragboxdepth) : 0;

        // check if dropzone exists
        if (!dropzone) return;

        this.log(`Creating dragbox in ${dropzone.id}...`, "dragbox-creating");

        // create a new dragbox
        const newDragbox = this.createDragbox(dragboxdepth);

        // create a new dropzone to contain the new dragbox
        const populatedDropzone = this.createDropzone().appendChild(newDragbox);

        // insert the new dragbox before the "placeholder" element which creates dragboxes on click
        dropzone.insertBefore(populatedDropzone, dropzone.childNodes[dropzone.childElementCount - 1]);

        // update DragboxJS
        this.update();
        
        // dispatch a dragboxCreated event to link other possible functions
        newDragbox.dispatchEvent(this.dragboxCreatedEvent);
    }

    /**
     * Calculate dragbox color based on settings and depth.
     * @param {HTMLElement} dragbox The element to stylize.
     */
    colorDragbox(dragbox) {
        if (this.options.dragbox.colorMethod == "alternate") {
            dragbox.style.background = dragbox.getAttribute('data-dragboxdepth') % 2 === 0 ?
                this.options.dragbox.primaryColor : this.options.dragbox.secondaryColor;
        } else if (this.options.dragbox.colorMethod == "shade") {
            const lightness = (dragbox.getAttribute('data-dragboxdepth') / 10) * 100;
            const hslColor = cssRgbToHsl(this.options.dragbox.primaryColor);
            dragbox.style.background = `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l + lightness}%)`;
        }
    }

    /**
     * Logging function that logs conditionally to user's settings.
     * @param {String} message Message to log.
     * @param {String} category Category of message.
     */
    log(message, category) {
        if (this.options.logging === 'none') return
        if (this.options.logging === 'all' || (Array.isArray(this.options.logging) && this.options.logging.includes(category))) {
            console.log(message);
        }
    };
}

export default DragboxJS;
