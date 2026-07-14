export function initializeHome() {
  console.log("Home Loaded");
  initializeIcons();
}

function initializeIcons() {
  if (!window.lucide) {
    console.error("Lucide failed to load.");
    return;
  }

  window.lucide.createIcons();
}
