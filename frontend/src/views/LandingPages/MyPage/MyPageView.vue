<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <NavbarDefault :sticky="true" />
      </div>
    </div>
  </div>
  <Header>
    <div class="page-header min-height-400" :style="{ backgroundImage: `url(${image})` }" loading="lazy">
      <span class="mask bg-gradient-dark opacity-8"></span>
    </div>
  </Header>

  <div class="bg-gray-200">
    <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6 mb-4">
      <Profile @open-modal-edit="openModalEdit" />
      <BestPosts />
      <Posts :data="data" @open-details-spot-modal="openDetailsSpotModal" />
    </div>
  </div>
  <DefaultFooter />
  <EditModal v-if="showModalEdit" @close="closeModalEdit" />
  <DetailsSpotModal v-if="showModalDetailsSpot" :post-id="selectedPostId" @close="closeDetailsSpotModal" />
</template>

<script setup>
import NavbarDefault from '../../../examples/navbars/NavbarDefault.vue';
import Header from "../../../examples/Header.vue";
import image from "@/assets/img/myPageBackimage.jpg";
import Profile from './Sections/MyPageProfile.vue';
import BestPosts from "./Sections/MyPageBestPosts.vue";
import Posts from './Sections/MyPagePosts.vue';
import DefaultFooter from '../../../examples/footers/FooterDefault.vue';
import EditModal from "../../../components/EditModal.vue";
import DetailsSpotModal from '../../../components/DetailsSpotModal.vue';
import { ref } from "vue";

const showModalEdit = ref(false);
const openModalEdit = () => showModalEdit.value = true;
const closeModalEdit = () => showModalEdit.value = false;

const selectedPostId = ref(null); // 선택된 게시글 ID
const showModalDetailsSpot = ref(false); // 모달 표시 여부

const openDetailsSpotModal = (postId) => {
  selectedPostId.value = postId; // 선택된 포스트 ID 설정
  showModalDetailsSpot.value = true; // 모달 표시
};

const closeDetailsSpotModal = () => {
  showModalDetailsSpot.value = false; // 모달 닫기
  selectedPostId.value = null; // 선택된 포스트 ID 초기화
  
};
</script>