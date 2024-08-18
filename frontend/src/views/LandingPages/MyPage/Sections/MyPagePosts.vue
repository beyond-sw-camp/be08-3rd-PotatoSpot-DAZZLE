<template>
  <section class="py-3">
    <div class="container">
      <div class="row">
        <h3 class="mb-0">내 게시물</h3>
      </div>
      <!-- v-if로 강제 재렌더링 -->
      <div v-if="firebaseUser" class="container mt-sm-3 mt-3 row">
        <div class="col-md-3 mt-md-4" v-for="photospot in filteredPhotoSpots" :key="photospot.id">
          <PostCard :image="photospot.imgUrl" :title="photospot.title" :subtitle="photospot.subtitle" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import PostCard from '../components/PostCard.vue';
import { usePhotoSpotStore } from '../../../../stores/photoSpotStore';
import { useUserStore } from '../../../../stores/userStore';

const photoSpotStore = usePhotoSpotStore();
const userStore = useUserStore();
const firebaseUser = ref(userStore.firebaseUser); // 로컬 상태로 저장

// 게시물 데이터 가져오기
const fetchPosts = async () => {
  await photoSpotStore.fetchPhotoSpots();
  console.log(photoSpotStore.photoSpots); // 콘솔에 출력하여 확인
};

// 컴포넌트가 마운트될 때 처음으로 게시물 데이터 가져오기
onMounted(async () => {
  await fetchPosts();
});

// 로그인 상태가 변경될 때 게시물 데이터 다시 가져오기
watch(
  () => userStore.firebaseUser,
  async (newUser, oldUser) => {
    if (newUser !== oldUser) {
      firebaseUser.value = newUser; // firebaseUser 상태 업데이트
      await fetchPosts();
    }
  }
);

// 현재 사용자의 게시물 필터링
const filteredPhotoSpots = computed(() => {
  return photoSpotStore.photoSpots.filter(
    photospot => photospot.userEmail === userStore.userEmail
  );
});
</script>
