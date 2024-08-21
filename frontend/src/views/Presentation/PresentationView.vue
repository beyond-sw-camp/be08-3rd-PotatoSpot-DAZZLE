<script setup>
import { onMounted, onUnmounted ,ref} from "vue";
import Thumbnails from "@/components/Thumbnails.vue";
import RankingList from "@/components/RankingList.vue";
import NavbarDefault from "../..//examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../examples/footers/FooterDefault.vue";
import Header from "../../examples/Header.vue";
import PresentationCounter from "./Sections/PresentationCounter.vue";
import vueMkHeader from "@/assets/img/vue-mk-header.jpg";
import DetailsSpotModal from "../../components/DetailsSpotModal.vue";

const showDetailSpotModal = ref(false);
const selectedPostId = ref(null);

const openDetailSpotModal = (postId) => {
  selectedPostId.value = postId;
  showDetailSpotModal.value = true;
};

const closeDetailSpotModal = () => {
  showDetailSpotModal.value = false;
  selectedPostId.value = null;
};

const body = document.getElementsByTagName("body")[0];
onMounted(() => {
  body.classList.add("presentation-page");
  body.classList.add("bg-gray-200");
  body.classList.add("presentation-page");
  body.classList.add("bg-gray-200");
});
onUnmounted(() => {
  body.classList.remove("presentation-page");
  body.classList.remove("bg-gray-200");
});

//anime
import TextAnime1 from "../../components/TextAnime1.vue";
const anime1 = true;
</script>

<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <NavbarDefault :sticky="true" />
      </div>
    </div>
  </div>
  <Header>
    <div
      class="page-header min-vh-75"
      :style="`background-image: url(${vueMkHeader})`"
      loading="lazy"
      id="top"
    >
      <div class="container">
        <div class="row">
          <div class="col-lg-7 text-center mx-auto position-relative">
            <h1
              class="text-white pt-3 mt-n5 me-2"
              :style="{ display: 'inline-block ' }"
            >
              <TextAnime1 v-if="anime1" />
            </h1>

            <p class="lead text-white px-5 mt-3" :style="{ fontWeight: '500' }">
              당신의 포토스팟을 공유하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Header>
  <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6">

    <div id="presentationCounter">
      <PresentationCounter />
    </div>

    <div id="thumbnails">
      <Thumbnails @open-details-spot-modal3="openDetailSpotModal"/>
    </div>

    <div id="rankingList">
      <RankingList/>
    </div>
  </div>
  <DefaultFooter />
  <DetailsSpotModal
    v-if="showDetailSpotModal"
    :post-id="selectedPostId"
    @close="closeDetailSpotModal"
  />
</template>

