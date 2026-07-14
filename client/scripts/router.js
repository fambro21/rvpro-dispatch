import { initializeHome } from "../pages/home/home.js";

const routes = {
  "/": {
    template: "/pages/home/home.html",
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
  const route = routes[currentPath] || routes["/"];

  try {
    const response = await fetch(route.template);

    if (!response.ok) {
      throw new Error(`Unable to load ${route.template}`);
    }

    const pageHtml = await response.text();
    const appElement = document.querySelector("#app");

    appElement.innerHTML = pageHtml;

    if (typeof route.initialize === "function") {
      route.initialize();
    }
  } catch (error) {
    console.error(error);

    document.querySelector("#app").innerHTML = `
      <section>
        <h1>Page unavailable</h1>
        <p>The page could not be loaded.</p>
      </section>
    `;
  }
}

function handleNavigationClick(event) {
  const link = event.target.closest("[data-link]");

  if (!link) {
    return;
  }

  event.preventDefault();

  const requestedPath = link.getAttribute("href");

  window.history.pushState({}, "", requestedPath);

  renderCurrentRoute();
}
