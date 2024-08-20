<script setup>
import { computed, watch, onMounted } from "vue";
import { useUserStore } from '../../../../stores/userStore';
import MaterialAvatar from "@/components/MaterialAvatar.vue";
import UserDataCounter from "../components/UserDataCounter.vue";
import setMaterialInput from "@/assets/js/material-input";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUserEdit, faThumbsUp, faFileAlt } from '@fortawesome/free-solid-svg-icons';

const userStore = useUserStore();

// computed를 사용하여 userStore의 상태를 동적으로 반영
const profilePic = computed(() => userStore.profilePic);
const userName = computed(() => userStore.userName);
const postCount = computed(() => userStore.postCount);
const totalLikes = computed(() => userStore.totalLikes);

onMounted(async () => {
  setMaterialInput();
  await userStore.fetchUserData(); // 페이지가 로드될 때 사용자 데이터를 가져옴
});

</script>

<template>
  <section class="profile-section py-4 position-relative" v-if="userStore.firebaseUser">
    <div class="container">
      <div class="row">
        <div class="col-12 mx-auto">
          <div class="avatar-container mt-n8 mt-md-n9 text-center">
            <div class="blur-shadow-avatar">
              <MaterialAvatar size="xxl" class="shadow-xl position-relative z-index-2 border border-light"
                :image="profilePic" alt="Avatar" />
            </div>
          </div>
          <div class="row py-5">
            <div class="col-lg-7 col-md-7 z-index-2 position-relative px-md-2 px-sm-5 mx-auto text-center">
              <h1 class="profile-name mb-3">{{ userName }}</h1>
              <button class="btn btn-gradient btn-lg mb-4" @click="$emit('open-modal-edit')">
                <FontAwesomeIcon :icon="faUserEdit" /> Edit Profile
              </button>
              <div class="d-flex justify-content-around align-items-center mb-4">
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
/* 기존 스타일 그대로 유지 */
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
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
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
