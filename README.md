# Hover Link Preview

## Overview

`link-preview` is a JavaScript package that provides a simple and customizable link preview functionality. It fetches metadata for a given URL and displays a preview when a link is hovered over.

## Installation

Install the package using npm:

```bash
npm install link-preview
```

## Usage

Import the package in your JavaScript file:

```javascript
import { linkPreview } from "link-preview";

// Initialize link preview with default options
linkPreview();
```

You can also customize the behavior by providing options:

```javascript
linkPreview({
    cacheTtl: 60 * 60, // Cache time-to-live in seconds
    selector: "data-custom-preview", // Custom attribute for links
    // ... other options
});
```

## Options

-   `cacheTtl` (default: 1800): Time-to-live for caching link metadata in seconds.
-   `selector` (default: 'data-link-preview'): Attribute used to select links for preview.
-   `defaultClass` (default: '__lp-preview'): Default class for the link preview.
-   ... and more customizable styling and behavior options.

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
        <link rel="stylesheet" href="../dist/styles.output.css" />
    </head>
    <body>
        <a href="https://example.com" data-link-preview
            >Hover me for a preview</a
        >

        <script type="module">
            import { linkPreview } from "link-preview";

            linkPreview();
        </script>
    </body>
</html>
```

## Contributing

Contributions are welcome! Please follow our [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
