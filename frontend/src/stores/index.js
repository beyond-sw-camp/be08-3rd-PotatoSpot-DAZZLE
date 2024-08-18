import { defineStore, createPinia } from "pinia";
import bootstrap from "bootstrap/dist/js/bootstrap.min.js";

// Define the Pinia store
export const useAppStore = defineStore("app", {
  state: () => ({
    bootstrap,
  }),
});

export const useUiStore = defineStore("ui", {
  state: () => ({
    leftMenu: {
      visible: true,
    },
  }),
  actions: {
    toggleMenu() {
      this.leftMenu.visible = !this.leftMenu.visible;
    },
    setMenuVisible(visible) {
      this.leftMenu.visible = visible;
    },
  },
});

// Create a Pinia instance
const pinia = createPinia();

export default pinia;
