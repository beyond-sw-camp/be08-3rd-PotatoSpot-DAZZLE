<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import RotatingCard from '../components/RotatingCard.vue';
import RotatingCardFront from "../components/RotatingCardFront.vue";
import RotatingCardBack from '../components/RotatingCardBack.vue';
import LikeCounter from "../components/LikeCounter.vue";
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

// 좋아요 수가 가장 많은 상위 4개의 게시물 선택
const bestPosts = computed(() => {
  if (!firebaseUser.value) return []; // 로그인하지 않은 경우 빈 배열 반환
  return filteredPhotoSpots.value
    .slice() // 원본 배열을 복사
    .sort((a, b) => b.likes - a.likes) // 좋아요 수로 내림차순 정렬
    .slice(0, 4); // 상위 4개 선택
});
</script>


<template>
  <section v-if="firebaseUser && bestPosts.length > 0" class="py-2">
    <div class="container">
      <div class="row" style="border-bottom: 1px solid lightgray;">
        <h3 class="mb-3">인기 포토스팟</h3>
      </div>
      <div class="row mt-5">
        <div v-for="(post, index) in bestPosts" :key="post.id" class="col-lg-3 col-sm-6">
          <RotatingCard>
            <RotatingCardFront :image="post.imgUrl" />
            <RotatingCardBack :image="post.imgUrl" :title="post.title" :description="post.content" :action="[
              {
                route: '/',
                label: '지도에서 확인하기',
              },
            ]" />
          </RotatingCard>
          <LikeCounter color="danger" :count="post.likes" suffix="♥️" :duration="3000" />
        </div>
      </div>
    </div>
  </section>
</template>
