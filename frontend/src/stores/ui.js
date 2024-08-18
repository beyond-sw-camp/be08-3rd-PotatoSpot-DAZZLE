import { defineStore } from "pinia";

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
