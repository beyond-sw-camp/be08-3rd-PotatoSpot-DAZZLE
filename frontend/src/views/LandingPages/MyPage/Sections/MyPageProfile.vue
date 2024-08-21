<script setup>
import { computed, onMounted, watch } from "vue";
import { useUserStore } from '../../../../stores/userStore';
import MaterialAvatar from "@/components/MaterialAvatar.vue";
import UserDataCounter from "../components/UserDataCounter.vue";
import setMaterialInput from "@/assets/js/material-input";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUserEdit, faThumbsUp, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { usePhotoSpotStore } from "../../../../stores/photoSpotStore";

const userStore = useUserStore();
const photoSpotStore = usePhotoSpotStore();

// computed를 사용하여 userStore의 상태를 동적으로 반영
const profilePic = computed(() => userStore.profilePic);
const userName = computed(() => userStore.userName);
const postCount = computed(() => {
  return photoSpotStore.photoSpots.filter(spot => spot.userEmail === userStore.userEmail).length;
});
const totalLikes = computed(() => {
  return photoSpotStore.photoSpots.reduce((acc, spot) => {
    return spot.userEmail === userStore.userEmail ? acc + spot.likes : acc;
  }, 0);
});

onMounted(async () => {
  setMaterialInput();
  await photoSpotStore.fetchPhotoSpots();
  await userStore.fetchUserData(); // 페이지가 로드될 때 사용자 데이터를 가져옴
});

// userStore나 photoSpotStore의 데이터가 변경되었을 때 데이터를 새로고침
watch([() => userStore.profilePic, () => photoSpotStore.photoSpots], async () => {
  await userStore.fetchUserData();
  await photoSpotStore.fetchPhotoSpots();
});

</script>

<template>
  <section class="profile-section py-1 position-relative" v-if="userStore.firebaseUser">
    <div class="container">
      <div class="row">
        <div class="col-12 mx-auto">
          <div class="avatar-container mt-n8 mt-md-n11 text-center">
            <div class="blur-shadow-avatar">
              <MaterialAvatar size="xxl" class="shadow-xl position-relative z-index-2 border border-light"
                :image="profilePic" alt="Avatar" />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-7 col-md-7 z-index-2 position-relative px-md-7 px-sm-2 mx-auto text-center">
              <h1 class="profile-name mb-5">{{ userName }}</h1>
              <button class="btn btn-gradient btn-lg mb-3" @click="$emit('open-modal-edit')">
                <FontAwesomeIcon :icon="faUserEdit" /> Edit Profile
              </button>
              <div class="d-flex justify-content-around align-items-center mb-2">
                <div class="col-auto text-center">
                  <UserDataCounter title="Posts" color="dark" :count="postCount" :duration="4000">
                    <FontAwesomeIcon :icon="faFileAlt" class="me-2" />
                  </UserDataCounter>
                </div>
                <div class="col-auto text-center">
                  <UserDataCounter title="Likes" color="dark" :count="totalLikes" :duration="4000">
                    <FontAwesomeIcon :icon="faThumbsUp" class="me-2" />
                  </UserDataCounter>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-section {
  color: white;
  padding-bottom: 50px;
}

.avatar-container {
  position: relative;
  z-index: 10;
}

.blur-shadow-avatar {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 50%;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: beige;
  text-shadow: 0px 2px 4px rgba(136, 134, 134, 0.774);
}

.btn-gradient {
  background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
}

.btn-gradient:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

h1 {
  margin-bottom: 0.5rem;
}

.fa-icon {
  font-size: 1.5rem;
  margin-right: 10px;
}
</style>
