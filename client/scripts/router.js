import { initializeHome } from "../pages/home/home.js";

const routes = {
  "/": {
    template: "/pages/home/home.html",
    style: "/pages/home/home.css",
    initialize: initializeHome,
  },
};

export function initializeRouter() {
  document.addEventListener("click", handleNavigationClick);
  window.addEventListener("popstate", renderCurrentRoute);

  renderCurrentRoute();
}

async function renderCurrentRoute() {
  const currentPath = window.location.pathname;
  const route = routes[currentPath];

  if (!route) {
    renderNotFoundPage();
    return;
  }

  try {
    showLoadingState();

    await loadPageStyle(route.style);

    const pageHtml = await loadPageTemplate(route.template);

    const appElement = document.querySelector("#app");

    appElement.innerHTML = pageHtml;

    if (typeof route.initialize === "function") {
      route.initialize();
    }
  } catch (error) {
    console.error(error);
    renderErrorPage();
  }
}

async function loadPageTemplate(templatePath) {
  const response = await fetch(templatePath);

  if (!response.ok) {
    throw new Error(`Unable to load template: ${templatePath}`);
  }

  return response.text();
}

function loadPageStyle(stylePath) {
  return new Promise((resolve, reject) => {
    const pageStyle = document.querySelector("#page-style");

    if (!pageStyle) {
      reject(new Error("The #page-style element was not found."));
      return;
    }

    const requestedStyleUrl = new URL(stylePath, window.location.origin).href;

    if (pageStyle.href === requestedStyleUrl) {
      resolve();
      return;
    }

    pageStyle.onload = () => {
      pageStyle.onload = null;
      pageStyle.onerror = null;

      console.log(`Stylesheet loaded: ${stylePath}`);
      resolve();
    };

    pageStyle.onerror = () => {
      pageStyle.onload = null;
      pageStyle.onerror = null;

      reject(new Error(`Unable to load stylesheet: ${stylePath}`));
    };

    pageStyle.href = stylePath;
  });
}

function handleNavigationClick(event) {
  const link = event.target.closest("[data-link]");

  if (!link) {
    return;
  }

  const href = link.getAttribute("href");

  if (!href || href.startsWith("http")) {
    return;
  }

  event.preventDefault();

  if (window.location.pathname === href) {
    return;
  }

  window.history.pushState({}, "", href);

  renderCurrentRoute();
}

function showLoadingState() {
  const appElement = document.querySelector("#app");

  appElement.innerHTML = `
    <section class="page-message">
      <p>Loading page...</p>
    </section>
  `;
}

function renderNotFoundPage() {
  document.querySelector("#app").innerHTML = `
    <section class="page-message">
      <h1>404</h1>
      <p>The page could not be found.</p>
      <a href="/" data-link>Return home</a>
    </section>
  `;
}

function renderErrorPage() {
  document.querySelector("#app").innerHTML = `
    <section class="page-message">
      <h1>Page unavailable</h1>
      <p>The page could not be loaded.</p>
    </section>
  `;
}
