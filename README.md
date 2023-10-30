# Hover Link Preview

## Overview

`tb-link-preview` is a JavaScript package that provides a simple and customizable link preview functionality. It fetches metadata for a given URL and displays a preview when a link is hovered over.

## Installation

Install the package using npm:

```bash
npm install tb-link-preview
```

## Usage

Import the package in your JavaScript file:

```javascript
import { linkPreview } from "tb-link-preview";

// Initialize link preview with default options
linkPreview();
```

You can also customize the behavior by providing options:

```javascript
linkPreview({
    cacheTtl: 60 * 60, // Cache time-to-live in seconds
    selector: "data-custom-preview", // Custom attribute for links
    defaultClass: "__lp-preview", // Custom class for rendered section
    rootClass: "", // Classes to apply to root div
    containerClass: "", // Classes to apply to container div
    imageClass: "", // Classes to apply to image div
    contentClass: "", // Classes to apply to content div (div containing title and description)
    titleClass: "", // Classes to apply to title
    descriptionClass: "", // Classes to apply to description
    zIndex: 100, // Custom z-index value for rendered section
    transitionInDelay: 50, // Min:1, delay the opacity-1 transition for animation (time in ms)
    transitionOutDelay: 350, // Min:1, delay the opacity-0 transition for animation (time in ms)
    debug: false, // Keep the rendered section visible at all time
});
```

## Debugging
You can enable debugging where the rendered section stays visible until the page is refreshed. It is useful when trying to add classes to the section.
Please note, the debug mode can introduce unwanted behaviors, and should only be used when testing.
To enable debugging, you can pass in the `debug` parameter while initializing.

```javascript
linkPreview({
    debug: false, // Keep the rendered section visible at all time
});
```

## Dependencies

-   [axios](https://www.npmjs.com/package/axios): Promise-based HTTP client.
-   [cheerio](https://www.npmjs.com/package/cheerio): jQuery-like library for parsing HTML.

## Example

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Link Preview Example</title>
    </head>
    <body>
        <a href="https://example.com" data-tb-link-preview
            >Hover me for a preview</a
        >

        <script type="module">
            import { linkPreview } from "tb-link-preview";

            linkPreview();
        </script>
    </body>
</html>
```

## Contributing

Contributions are welcome! Please follow our [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
