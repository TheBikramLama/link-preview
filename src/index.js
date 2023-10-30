import "../dist/styles.output.css";
import axios from "axios";
import * as cheerio from "cheerio";

export function linkPreview(options = {}) {
  let cacheTtl = options.cacheTtl ?? 30 * 60;

  /**
   * Fetches metadata for a given URL, either from the local cache or by making
   * a request to the server.
   *
   * @param {string} url - The URL to fetch metadata for.
   * @returns {Promise<Object>} - A Promise that resolves with metadata.
   */
  async function metaFetch(url) {
    const now = new Date().getTime() / 1000;

    let meta = {
      title: "",
      description: "",
      image: "",
      expiry: now + cacheTtl,
    };

    if (localStorage.getItem(`link-preview-${url}`)) {
      let cachedMeta = JSON.parse(localStorage.getItem(`link-preview-${url}`));

      if (cachedMeta.expiry > now) {
        return cachedMeta;
      }
    }

    try {
      let response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const metaTags = $("meta");
      meta.title = $("title").text();

      for (let tag of metaTags) {
        const name = $(tag).attr("name") ?? $(tag).attr("itemprop");
        const content = $(tag).attr("content");

        switch (name) {
          case "title":
            meta.title = content;
            break;

          case "description":
            meta.description = content;
            break;

          case "image":
            meta.image = content;
            break;

          default:
            break;
        }
      }

      localStorage.setItem(`link-preview-${url}`, JSON.stringify(meta));

      return meta;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * The main application object.
   *
   * @type {Object}
   */
  let app = {
    /**
     * An array of links to apply the link preview to.
     *
     * @type {NodeList}
     */
    links: [],
    /**
     * Options for configuring the link preview.
     *
     * @type {Object}
     */
    options: {},

    /**
     * Initializes the link preview application.
     *
     * @param {Object} options - Configuration options for the link preview.
     */
    init(options) {
      this.options = {
        selector: options.selector || "data-tb-link-preview",
        defaultClass: options.defaultClass || "__lp-preview",
        rootClass:
          options.rootClass ||
          "pt-1 text-slate-600 transition w-[280px] duration-300",
        containerClass:
          options.containerClass || "bg-white rounded border overflow-hidden",
        imageClass: options.imageClass || "h-[140px] w-full object-cover",
        contentClass: options.contentClass || "px-4 py-2",
        titleClass: options.titleClass || "line-clamp-1 font-semibold mb-2",
        descriptionClass:
          options.descriptionClass || "line-clamp-2 leading-tight",
        zIndex: options.zIndex || 100,
        transitionInDelay: options.transitionInDelay || 50,
        transitionOutDelay: options.transitionOutDelay || 350,
        debug: options.debug || false
      };
      this.links = document.querySelectorAll(`[${this.options.selector}]`);

      this.listen();
    },

    /**
     * Adds event listeners to the links for mouseover and mouseout events.
     */
    listen() {
      if (this.links.length === 0) {
        return;
      }

      for (let link of this.links) {
        link.addEventListener("mouseover", this.renderPreview);
        link.addEventListener("mouseout", this.destroyRender);
      }
    },

    /**
     * Generates the HTML template for the link preview.
     *
     * @param {Object} bound - The bounding rectangle of the link.
     * @param {Object} metaTags - Metadata for the link.
     *
     * @returns {string} - The HTML template for the link preview.
     */
    getTemplate(bound, metaTags) {
      let {
        defaultClass,
        rootClass,
        containerClass,
        imageClass,
        contentClass,
        titleClass,
        descriptionClass,
        zIndex,
      } = app.options;

      let { title, description, image } = metaTags;

      let styles = `
        position: absolute;
        top: ${bound.height};
        left: 0;
        opacity: 0;
        z-index: ${zIndex};
      `;

      let imgSection = `<img src="${image}" class="${imageClass}">`;
      let titleSection = `<h3 class="${titleClass}">${title}</h3>`;
      let descriptionSection = `<p class="${descriptionClass}">${description}</p>`;

      return `
        <div class="${defaultClass} ${rootClass}" style="${styles}">
          <div class="${containerClass}">
            ${imgSection}
            <div class="${contentClass}">
              ${titleSection}
              ${descriptionSection}
            </div>
          </div>
        </div>
      `;
    },

    /**
     * Displays the link preview by setting the opacity of the previews to 1.
     */
    displayPreview() {
      let previews = document.querySelectorAll(`.${app.options.defaultClass}`);

      for (let preview of previews) {
        preview.style.opacity = 1;
      }
    },

    /**
     * Renders the link preview when a link is hovered over.
     * @param {Event} event - The mouseover event.
     */
    renderPreview(event) {
      let anchor = event.target;
      let bound = anchor.getBoundingClientRect();

      if (typeof anchor.getAttribute(app.options.selector) !== "string") {
        return;
      }

      if (!!app.options.debug) {
        app.deletePreviews();
      }

      (async () => {
        try {
          let metaTags = await metaFetch(anchor.getAttribute("href"));
          let template = app.getTemplate(bound, metaTags);

          anchor.style.position = "relative";
          anchor.insertAdjacentHTML("beforeend", template);
          setTimeout(() => app.displayPreview(), app.options.transitionInDelay);
        } catch (error) {
          console.error(error);
        }
      })();
    },

    deletePreviews() {
      let previews = document.querySelectorAll(`.${app.options.defaultClass}`);

      for (let preview of previews) {
        preview.style.opacity = 0;
        setTimeout(() => preview.remove(), app.options.transitionOutDelay);
      }
    },

    /**
     * Destroys the link preview by setting the opacity of the previews to 0 and
     * removing them after a delay.
     */
    destroyRender() {
      if (!!app.options.debug) {
        return;
      }

      app.deletePreviews();
    },
  };

  /**
   * Initializes the link preview application with default options.
   */
  app.init(options);

  return app;
}
