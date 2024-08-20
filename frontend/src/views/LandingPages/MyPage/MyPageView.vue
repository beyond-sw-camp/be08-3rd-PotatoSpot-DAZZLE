<script setup>
import Header from "../../../examples/Header.vue";
import image from "@/assets/img/myPageBackimage.jpg";
import Profile from './Sections/MyPageProfile.vue';
import BestPosts from "./Sections/MyPageBestPosts.vue";
import Posts from './Sections/MyPagePosts.vue';
import DefaultFooter from '../../../examples/footers/FooterDefault.vue';
import data from './Data/postCardData';
import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";
import EditModal from "../../../components/EditModal.vue";

import { ref } from "vue";

const showModalEdit = ref(false);
const openModalEdit = () => showModalEdit.value = true;
const closeModalEdit = () => showModalEdit.value = false;
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
    <div class="page-header min-height-400" :style="{ backgroundImage: `url(${image})` }" loading="lazy">
      <span class="mask bg-gradient-dark opacity-8"></span>
    </div>
  </Header>

  <div class="bg-gray-200">
    <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6 mb-4">
      <Profile @open-modal-edit="openModalEdit" />
      <BestPosts />
      <Posts :data="data" />
    </div>
  </div>
  <DefaultFooter />
  <EditModal v-if="showModalEdit" @close="closeModalEdit" />
</template>