<script setup>
import { RouterLink, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { useWindowsWidth } from "../../assets/js/useWindowsWidth";
import { useUserStore } from "../../stores/userStore";
import LoginModal from '../../components/sign/LoginModal.vue';
import SignUpModal from '../../components/sign/SignUpModal.vue';
import { auth } from "../../firebase";
import PostModal from "../../components/PostModal.vue"



// images
import ArrDark from "@/assets/img/down-arrow-dark.svg";
import DownArrWhite from "@/assets/img/down-arrow-white.svg";

const userStore = useUserStore();
const router = useRouter();

const showModalLogin = ref(false);
const showModalSignUp = ref(false);
const showModalPost = ref(false);
const openModalLogin = () => showModalLogin.value = true;
const closeModalLogin = () => showModalLogin.value = false;
const openModalSignUp = () => showModalSignUp.value = true;
const closeModalSignUp = () => showModalSignUp.value = false;
const openModalPost = () => showModalPost.value = true;
const closeModalPost = () => showModalPost.value = false;

const handleLogout = async () => {
  try {
    await auth.signOut();
    router.push('/');
  } catch (error) {
    console.error("로그아웃 중 오류 발생:", error);
  }
};

const props = defineProps({
  action: {
    type: Object,
    route: String,
    color: String,
    label: String,
    default: () => ({
      route: "https://www.creative-tim.com/product/vue-material-kit",
      color: "bg-gradient-info",
    })
  },
  transparent: {
    type: Boolean,
    default: false
  },
  light: {
    type: Boolean,
    default: false
  },
  dark: {
    type: Boolean,
    default: false
  },
  sticky: {
    type: Boolean,
    default: false
  },
  darkText: {
    type: Boolean,
    default: false
  }
});

// set arrow  color
function getArrowColor() {
  if (props.transparent && textDark.value) {
    return ArrDark;
  } else if (props.transparent) {
    return DownArrWhite;
  } else {
    return ArrDark;
  }
}

// set text color
const getTextColor = () => {
  let color;
  if (props.transparent && textDark.value) {
    color = "text-dark";
  } else if (props.transparent) {
    color = "text-white";
  } else {
    color = "text-dark";
  }

  return color;
};

// set nav color on mobile && desktop

let textDark = ref(props.darkText);
const { type } = useWindowsWidth();

if (type.value === "mobile") {
  textDark.value = true;
} else if (type.value === "desktop" && textDark.value == false) {
  textDark.value = false;
}

watch(
  () => type.value,
  (newValue) => {
    if (newValue === "mobile") {
      textDark.value = true;
    } else {
      textDark.value = false;
    }
  }
);
</script>
<template>
  <nav class="navbar navbar-expand-lg top-0" :class="{
    'z-index-3 w-100 shadow-none navbar-transparent position-absolute my-3':
      props.transparent,
    'my-3 blur border-radius-lg z-index-3 py-2 shadow py-2 start-0 end-0 mx-4 position-absolute mt-4':
      props.sticky,
    'navbar-light bg-white py-3': props.light,
    ' navbar-dark bg-gradient-dark z-index-3 py-3': props.dark
  }">
    <div :class="props.transparent || props.light || props.dark
      ? 'container'
      : 'container-fluid px-0'
      ">
      <RouterLink class="navbar-brand d-none d-md-block" :class="[
        (props.transparent && textDark.value) || !props.transparent
          ? 'text-dark font-weight-bolder ms-sm-3'
          : 'text-white font-weight-bolder ms-sm-3'
      ]" :to="{ name: 'presentation' }" rel="tooltip" title="Designed and Coded by Creative Tim"
        data-placement="bottom">
        DAZZLE
      </RouterLink>
      <RouterLink class="navbar-brand d-block d-md-none" :class="props.transparent || props.dark
        ? 'text-white'
        : 'font-weight-bolder ms-sm-3'
        " to="/" rel="tooltip" title="Designed and Coded by Creative Tim" data-placement="bottom">
        Material Design
      </RouterLink>
      <a href="https://www.creative-tim.com/product/vue-material-kit-pro"
        class="btn btn-sm bg-gradient-success mb-0 ms-auto d-lg-none d-block">Buy Now</a>
      <button class="navbar-toggler shadow-none ms-2" type="button" data-bs-toggle="collapse"
        data-bs-target="#navigation" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon mt-2">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div class="collapse navbar-collapse w-100 pt-3 pb-2 py-lg-0" id="navigation">
        <ul class="navbar-nav navbar-nav-hover ms-auto">
          <li class="nav-item mx-2">
            <RouterLink v-if="userStore.firebaseUser != null" :to="{ name: 'mypage' }" role="button"
              class="nav-link ps-2 d-flex cursor-pointer align-items-center" :class="getTextColor()"
              aria-expanded="false">
              <i class="material-icons opacity-6 me-2 text-md" :class="getTextColor()">account_circle</i>
              My Page
            </RouterLink>
            <a v-else @click="openModalLogin" role="button"
              class="nav-link ps-2 d-flex cursor-pointer align-items-center" :class="getTextColor()"
              aria-expanded="false">
              <i class="material-icons opacity-6 me-2 text-md" :class="getTextColor()">account_circle</i>
              My Page
            </a>
            <div class="dropdown-menu dropdown-menu-animation ms-n3 dropdown-md p-3 border-radius-xl mt-0 mt-lg-3"
              aria-labelledby="dropdownMenuPages">
              <div class="row d-none d-lg-block">
                <div class="col-12 px-4 py-2">
                  <div class="row">
                    <div class="position-relative">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li class="nav-item dropdown dropdown-hover mx-2">
            <a @click="openModalPost" role="button" class="nav-link ps-2 d-flex cursor-pointer align-items-center"
              :class="getTextColor()" id="dropdownMenuBlocks" aria-expanded="false">
              <i class="material-icons opacity-6 me-2 text-md" :class="getTextColor()">article</i>
              Posts
            </a>
          </li>
          <li class="nav-item dropdown dropdown-hover mx-2">
            <RouterLink :to="{ name: 'map' }" role="button"
              class="nav-link ps-2 d-flex cursor-pointer align-items-center" :class="getTextColor()"
              aria-expanded="false">
              <i class="material-icons opacity-6 me-2 text-md" :class="getTextColor()">map</i>
              Map
            </RouterLink>
          </li>
          <li v-if="userStore.firebaseUser == null" class="nav-item dropdown dropdown-hover mx-2">
            <a @click="openModalLogin" class="nav-link d-flex cursor-pointer align-items-center">
              <i class="material-icons opacity-6 me-2 text-md" :class="getTextColor()">
                login
              </i>
              로그인
            </a>
          </li>
          <li v-else class="nav-item dropdown dropdown-hover mx-2">
            <a @click="handleLogout" class="nav-link d-flex cursor-pointer align-items-center">
              <i class="material-icons opacity-6 me-2 text-md" :class="getTextColor()">
                logout
              </i>
              로그아웃
            </a>
          </li>
        </ul>
        <ul v-if="userStore.firebaseUser == null" class="navbar-nav d-lg-block d-none">
          <li class="nav-item">
            <a @click="openModalSignUp" class="btn btn-sm mb-0 bg-info" :class="action.color"
              onclick="smoothToPricing('pricing-soft-ui')">회원 가입</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <LoginModal v-if="showModalLogin" @close="closeModalLogin" @signupModal="openModalSignUp" />
  <SignUpModal v-if="showModalSignUp" @close="closeModalSignUp" @loginModal="openModalLogin" />
  <PostModal v-if="showModalPost" @close="closeModalPost" />
  <!-- End Navbar -->
</template>