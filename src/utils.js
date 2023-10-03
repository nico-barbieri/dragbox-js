/**
 * Convert RGB values to HSL (Hue, Saturation, Lightness).
 * @param {number} r - The red channel value (0-255).
 * @param {number} g - The green channel value (0-255).
 * @param {number} b - The blue channel value (0-255).
 * @returns {object} An object containing HSL values: { h, s, l }
 */
export const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360), // Convert hue to degrees
        s: Math.round(s * 100), // Convert saturation to percentage
        l: Math.round(l * 100)  // Convert lightness to percentage
    };
}

/**
 * Convert a CSS RGB color string to HSL format.
 * @param {string} rgbString - The CSS RGB color string (e.g., "rgb(255, 0, 0)").
 * @returns {object} An object containing HSL values: { h, s, l }
 * @throws {Error} Throws an error if the input format is invalid.
 */
export const cssRgbToHsl = rgbString => {
    // Extract individual RGB values from the CSS format string
    const rgbValues = rgbString.match(/\d+/g);
    
    if (rgbValues && rgbValues.length === 3) {
        const r = parseInt(rgbValues[0]);
        const g = parseInt(rgbValues[1]);
        const b = parseInt(rgbValues[2]);

        // Convert RGB to HSL
        const hslColor = rgbToHsl(r, g, b);
        return hslColor;
    } else {
        throw new Error('Invalid RGB format');
    }
}

/**
 * Deep merge multiple objects into one.
 * @param {object} target - The target object to merge into.
 * @param {...object} sources - The source objects to merge into the target.
 * @returns {object} The merged object.
 */
export const deepMerge = (target, ...sources) => {
    for (const source of sources) {
        if (typeof source !== 'object') continue;
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    target[key] = deepMerge(target[key] || {}, source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
}

/**
 * Calculate the depth of an element with a specific class in the DOM tree.
 * @param {HTMLElement} element - The element to calculate the depth for.
 * @param {string} className - The class name to search for in parent elements.
 * @returns {number} The depth of the element with the specified class in the DOM tree.
 */
export const calculateDepth = (element, className) => {
    let depth = 1; 
    let parent = element.parentElement;

    while (parent) {
        if (parent.classList.contains(className)) {
            depth++;
        }
        parent = parent.parentElement;
    }

    return depth;
}

/**
 * Find the first parent element with a specific class.
 * @param {HTMLElement} element - The element to start the search from.
 * @param {string} className - The class name to search for in parent elements.
 * @returns {HTMLElement|null} The first parent element with the specified class, or null if not found.
 */
export const findParentWithClass = (element, className) => {
    let parent = element.parentElement;
    while (parent) {
      if (parent.classList.contains(className)) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null; // If no matching parent is found
  }