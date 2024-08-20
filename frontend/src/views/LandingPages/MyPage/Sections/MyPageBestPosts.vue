<template>
  <section v-if="firebaseUser && bestPosts.length > 0" class="best-posts-section py-3">
    <div class="container">
      <div class="row section-header">
        <h3 class="mb-3 text-center">인기 포토스팟</h3>
      </div>
      <div class="row">
        <div v-for="(post, index) in bestPosts" :key="post.id" class="col-lg-3 col-sm-6 d-flex justify-content-center mb-6 position-relative">
          <div class="card-container">
            <LikeCounter class="like-counter position-absolute" color="danger" :count="post.likes" suffix="♥️" :duration="3000" />
            <RotatingCard class="rotating-card">
              <RotatingCardFront :image="post.imgUrl" />
              <RotatingCardBack :image="post.imgUrl" :title="post.title" :description="post.content" :action="[
                {
                  route: `/map/${post.x}/${post.y}`,
                  label: '지도에서 확인하기',
                },
              ]" />
            </RotatingCard>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


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

<style scoped>
.best-posts-section {
  color: white;
  padding-bottom: 50px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.section-header {
  border-bottom: 2px solid #f8c0c0;
  padding-bottom: 10px;
}

.section-header h3 {
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
  color: #f76969;
}

.card-container {
  position: relative;
  width: 100%;
  max-width: 350px;
}

.rotating-card {
  width: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.like-counter {
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px 10px;
  border-radius: 20px;
  color: #ff6b6b;
  z-index: 10;
}
</style>
