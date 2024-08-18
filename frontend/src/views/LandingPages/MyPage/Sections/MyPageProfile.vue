<script setup>
import { onMounted } from "vue";

//Vue Material Kit 2 components
import MaterialAvatar from "@/components/MaterialAvatar.vue";

// image
import profilePic from "@/assets/img/bruce-mars.jpg";

// material-input
import setMaterialInput from "@/assets/js/material-input";
import UserDataCounter from "../components/userDataCounter.vue";
onMounted(() => {
  setMaterialInput();
});
</script>
<template>
  <section class="py-4 position-relative">
    <div class="container">
      <div class="row">
        <div class="col-12 mx-auto">
          <div class="mt-n8 mt-md-n9 text-center">
            <div class="blur-shadow-avatar">
              <MaterialAvatar size="xxl" class="shadow-xl position-relative z-index-2" :image="profilePic"
                alt="Avatar" />
            </div>
          </div>
          <div class="row py-5">
            <div class="col-lg-7 col-md-7 z-index-2 position-relative px-md-2 px-sm-5 mx-auto">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="mb-3">이름</h3>
                <div class="col-auto">
                  <UserDataCounter title="게시글" color="dark" :count="100" :duration="2000" />
                </div>
                <div class="col-auto">
                  <UserDataCounter title="좋아요" color="dark" :count="100" :duration="2000" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
