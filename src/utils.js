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