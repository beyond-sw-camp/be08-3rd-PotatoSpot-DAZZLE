import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import AOS from 'aos';
import "aos/dist/aos.css";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import materialKit from "./material-kit";

const app = createApp(App);

AOS.init();

app.use(createPinia());
app.use(router);
app.use(materialKit);
app.mount("#app");
