# DragboxJS Library

DragboxJS Library is a lightweight JavaScript library that simplifies the implementation of drag-and-drop functionality for nested elements within a web page. This library allows you to create draggable boxes, nest them within drop zones, and customize their appearance and behavior.

## Table of Contents
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Installation \[NOT PUBLISHED YET! CANNOT BE INSTALLED WITH NPM\]

To use DragboxJS Library in your project, follow these installation steps:

#### Using npm

You can install the library via npm:

```bash
npm install dragbox-js
```

#### Direct Download

Alternatively, you can download the library files from the [GitHub repository](https://github.com/nico-barbieri/dragbox-js) and include them in your project manually.

### Usage

Here's how you can get started with DragboxJS Library:

```html
<!-- Include the library files -->
<link rel="stylesheet" href="path/to/dragbox.css">
<script src="path/to/dragbox.js"></script>

<!-- Create a container for drag-and-drop elements -->
<div id="dragbox-container" class="dragbox-container">
  <!-- Create a template for dragboxes -->
  <div id="dragbox-template">
    <!-- Customize your dragbox template here -->
  </div>
</div>


<!-- Initialize the library with options -->
<script>
  const options = {
    dragging: {
      free: false, // Set to true for free dragging
    },
    dragbox: {
      colorMethod: "shade", // Set color method to "alternate" or "shade"
      // Define primaryColor and secondaryColor if needed
    },
  };

  dragboxStart(options);
</script>
```

## Configuration

DragboxJS Library can be configured to meet your specific requirements. Here are some key configuration options:

- `dragging.free`: Set to `true` for free dragging; otherwise, set to `false`.

- `dragbox.colorMethod`: Choose between "alternate" or "shade" for box coloring.

- `dragbox.primaryColor`: Define the primary color for dragboxes (if needed).

- `dragbox.secondaryColor`: Define the secondary color for dragboxes (if needed).

Please refer to the [API Reference](#api-reference) section for more detailed configuration options.

## API Reference

### `dragboxStart(options)`

Initialize the library with custom options.

- `options` (Object): An object containing configuration options. See the [Configuration](#configuration) section for available options.

### Other Functions

WIP: Description of other useful functions.

## Examples

WIP: Usage examples.

```html
<!-- Example usage code -->
```

## Contributing

Contributions to DragboxJS Library are welcome! If you have any ideas for improvements or find any issues, please open an issue or submit a pull request on the [GitHub repository](https://github.com/nico-barbieri/dragbox-js).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.