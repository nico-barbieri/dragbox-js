# DragboxJS (WIP)

**DragboxJS** is a lightweight JavaScript library designed to easily create and manage nested drag-and-drop containers within a web page. It offers an intuitive way to create draggable boxes (dragboxes) and customizable dropzones, enhancing user interaction without unnecessary complexity. DragboxJS has the ability to nest dragboxes while maintaining a straightforward DOM structure. This feature allows you to organize content effortlessly, making it ideal for creating interactive user interfaces.

***Note:** This project is a work in progress, and there are parts that may not be fully functional or complete. Feel free to contribute to its development. Feedback and contributions are greatly appreciated.*

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
  - [Initialization](#initialization)
  - [Creating Dragboxes](#creating-dragboxes)
  - [Customization](#customization)
- [Events](#events)
- [Options](#options)
- [Methods](#methods)
- [Contributing](#contributing)
- [License](#license)

## Installation

To use DragboxJS in your project, follow these steps:

1. **Download**: Download the DragboxJS library files from the [GitHub repository](https://github.com/nico-barbieri/dragbox-js).

2. **Include the Library**: First, include the DragboxJS library in your HTML file.

    ```html
    <script src="path/to/dragbox.js"></script>
    ```

    Additionally, you can include the base styles for DragboxJS by linking dragbox.css to your HTML's `<head>`:

    ```html
    <link rel="stylesheet" type="text/css" href="path/to/dragbox.css">
    ```

    The style can be changed, but consider that the style may affect the DragboxJS behaviour.

3. **Initialize DragboxJS**: Initialize DragboxJS by following the [Usage](#usage) instructions below.

## Usage

### Initialization

To get started with DragboxJS, you need to create an instance of it and initialize it with your container and template elements. Here's how you can do it:

```javascript
// Create an instance of DragboxJS
const dragbox = new DragboxJS("dragbox-container", "dragbox-template", {
  // Configuration options (see Options section)
});

// Initialize DragboxJS
dragbox.init();
```

- `dragbox-container`: The ID of the container element where dragboxes and dropzones will be placed.
- `dragbox-template`: The ID of the template element that will be used to create new dragboxes.

### Creating Dragboxes

You can create dragboxes by clicking on the "Add" button in a dropzone. Dragboxes are draggable elements that you can move within the container. Each dragbox can contain other dragboxes and dropzones. Each dragbox contains a copy of your template element. 
(The possibility to create different dragboxes from different templates will be implemented).

### Customization

You can customize the appearance and behavior of DragboxJS using the configuration options object provided when initializing the library. Refer to [Options](#options) section for further instructions.

In addition to that, DragboxJS provides several classes and attributes that you can customize to suit your needs:

- **dragboxjs-container:** This class represents the container that holds your DragboxJS instance.

- **dragbox:** This class represents individual dragbox elements created by DragboxJS. 

- **dropzone:** These elements represent areas where you can drop your dragboxes. 

- **dragging:** When a dragbox is being moved, this class is temporarily added to the dragged element. You can use this class to style the appearance of a dragging dragbox differently from others.

- **empty:** This class is added to dropzones that do not contain any dragboxes. You can style these empty dropzones differently to indicate potential drop locations.

- **dragbox-placeholder:** This class is used for the empty dropzone that displays the "+" button (".dragbox-add"), that allows you to create new dragboxes within it.

Additionally, each dragbox and dropzone created by DragboxJS will have a unique ID generated at the time of creation. This ensures that you can identify and target specific elements when customizing their appearance or behavior.

Each dragbox also contains a `data-dragboxdepth` attribute, starting from the value 1, which represents the nesting depth of the element. For example, if you have a dragbox within another dragbox, the deeper one will have a `data-dragboxdepth` of 2. This attribute can be useful when applying different styles or behaviors to nested dragboxes.

## Events

DragboxJS provides custom events that you can use to enhance the functionality of your web application. Here are the available custom events:

- `dragboxCreated`: Triggered when a new dragbox is created.
- `dragboxMoved`: Triggered when a dragbox is moved within the container.

You can listen for these events and add custom event handlers to perform actions based on these events.

```javascript
dragbox.container.addEventListener('dragboxCreated', (event) => {
  // Handle dragboxCreated event
  console.log(`Dragbox created: ${event.target.id}`);
});

dragbox.container.addEventListener('dragboxMoved', (event) => {
  // Handle dragboxMoved event
  console.log(`Dragbox moved: ${event.target.id}`);
});
```
## Options

DragboxJS provides various options that allow you to customize its behavior. You can pass an options object when initializing DragboxJS. Here are the available options:

- `logging`: Controls logging behavior for debugging purposes. Options include 'none', 'all', or an array of specific event categories optionally specified: ['dragbox-creating', 'dragbox-dragstart']

- `dragging.free`: Set to `true` for free dragging; otherwise, set to `false`. ***NOTE:** free dragging is not implemented yet.*

- `dragbox.colorMethod`: Choose between "alternate" or "shade" for box coloring.
- `dragbox.primaryColor`: Define the primary color for dragboxes.
- `dragbox.secondaryColor`: Define the secondary color for dragboxes (if alternate method is chosen, otherwise primary color will be used for the gradient).

## Methods


#### `init()`

The `init()` method sets up the DragboxJS instance. It checks for the presence of the required container and template elements and prepares the container for drag-and-drop functionality. This method adds essential classes and styles to the container and initializes the initial dropzone.

Example usage:

```javascript
const dragbox = new DragboxJS("dragbox-container", "dragbox-template", options);
dragbox.init();
```

#### `update()`

Use the `update()` method to refresh the state of the DragboxJS instance. This method should be called whenever you make changes to dragboxes or dropzones within the container. It updates the visual representation of empty dropzones and recalculates the depth and color of dragboxes.

Example usage:

```javascript
dragbox.update();
```

#### `createDragbox(depth)`

The `createDragbox(depth)` method allows you to programmatically create a new dragbox within the DragboxJS container. `Depth` represents the nesting level of the dragbox in which the new dragbox is created and it's used to calculate the data-dragboxdepth value of the new dragbox (`depth + 1`). The method returns the newly created dragbox element. 
While this method is primarily used internally by the library, you can also utilize it if necessary.

Example usage:

```javascript
const newDragbox = dragbox.createDragbox(2);
```

#### `createDropzone()`

The `createDropzone()` method generates a new dropzone element that can be used within your DragboxJS container. This method, as the previous one, is primarily used internally by the library during initialization and when adding new dropzones, but you can also utilize it to create custom dropzones if necessary.

Example usage:

```javascript
const customDropzone = dragbox.createDropzone();
```

## Contributing

Contributions to DragboxJS Library are welcome! If you have any ideas for improvements or find any issues, please open an issue or submit a pull request on the [GitHub repository](https://github.com/nico-barbieri/dragbox-js).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.