export default defineNuxtPlugin(() => {
  if (process.client) {
    document.documentElement.style.setProperty('--client-width', `${window.innerWidth}px`)
  }
})