import { createRouter, createWebHistory } from "vue-router";
import PresentationView from "../views/Presentation/PresentationView.vue";
import MyPageView from '../views/LandingPages/MyPage/MyPageView.vue';
import MapView from "../views/LandingPages/Map/MapView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "presentation",
      component: PresentationView,
    },
    {
      path: "/mypage",
      name: "mypage",
      component: MyPageView,
    },
    {
      path: "/map",
      name: "map",
      component: MapView,
    },  
  ],
});

export default router;
