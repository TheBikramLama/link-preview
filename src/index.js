import "../dist/styles.output.css";
import axios from "axios";
import * as cheerio from "cheerio";

export function testJs(options = {}) {
  let cacheTtl = options.cacheTtl ?? 30 * 60;

  let metaFetch = async (url) => {
    let now = new Date().getTime() / 1000;

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

      metaTags.each((i, tag) => {
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
      });

      localStorage.setItem(`link-preview-${url}`, JSON.stringify(meta));

      return meta;
    } catch (error) {
      console.error(error);
    }
  };

  let app = {
    links: [],
    options: {},

    init(links, options) {
      this.links = links;
      this.options = options;

      this.listen();
    },

    listen() {
      if (this.links != []) {
        for (let link of this.links) {
          link.addEventListener("mouseover", this.renderPreview);
          link.addEventListener("mouseout", this.destroyRender);
        }
      }
    },

    getTemplate(bound, metaTags) {
      let options = app.options;
      let styles = `
        position: absolute;
        top: ${bound.height};
        left: 0;
        opacity: 0;
        z-index: ${options.zIndex};
      `;

      return `
        <div class="${options.defaultClass} ${options.rootClass}" style="${styles}">
          <div class="${options.containerClass}">
            <img src="${metaTags.image}" class="${options.imageClass}">
            <div class="${options.contentClass}">
              <h3 class="${options.titleClass}">
                ${metaTags.title}
              </h3>
              <p class="${options.descriptionClass}">
                ${metaTags.description}
              </p>
            </div>
          </div>
        </div>
      `;
    },

    displayPreview() {
      let previews = document.querySelectorAll(`.${app.options.defaultClass}`);

      for (let preview of previews) {
        preview.style.opacity = 1;
      }
    },

    renderPreview(e) {
      let anchor = e.target;
      let bound = anchor.getBoundingClientRect();

      if (typeof anchor.getAttribute("data-link-preview") != "string") {
        return;
      }

      (async () => {
        let metaTags = await metaFetch(anchor.getAttribute("href"));
        let template = app.getTemplate(bound, metaTags);

        anchor.style.position = "relative";
        anchor.innerHTML += template;
        setTimeout(() => app.displayPreview(), app.options.transitionInDelay);
      })();
    },

    destroyRender() {
      let previews = document.querySelectorAll(`.${app.options.defaultClass}`);

      for (let preview of previews) {
        preview.style.opacity = 0;
        setTimeout(() => preview.remove(), app.options.transitionOutDelay);
      }
    },
  };

  app.init(document.querySelectorAll("[data-link-preview]"), {
    defaultClass: "__lp-preview",
    rootClass: "pt-1 text-slate-600 transition w-[280px] duration-300",
    containerClass: "bg-white rounded border overflow-hidden",
    imageClass: "h-[140px] w-full object-cover",
    contentClass: "px-4 py-2",
    titleClass: "line-clamp-1 font-semibold mb-2",
    descriptionClass: "line-clamp-2 leading-tight",
    zIndex: 100,
    transitionInDelay: 50,
    transitionOutDelay: 350,
    ...options,
  });
}
