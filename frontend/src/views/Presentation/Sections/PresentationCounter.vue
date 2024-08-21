<script setup>
import DefaultCounterCard from "../../../examples/cards/counterCards/DefaultCounterCard.vue";
import { usePhotoSpotStore } from '@/stores/photoSpotStore';
import { onMounted } from 'vue';

const photoSpotStore = usePhotoSpotStore();

onMounted(async () => {
  await photoSpotStore.fetchPhotoSpots(); // 게시물 데이터를 가져옵니다.
});
</script>

<template>
  <section class="pt-3 pb-4" id="count-stats">
    <div class="container">
      <div class="row justify-content-center align-items-center">
        <div class="col-lg-9 z-index-2 border-radius-xl mx-auto py-3">
          <div class="row justify-content-center align-items-center">
            <!-- 전체 게시글 수 -->
            <div class="col-md-4 position-relative d-flex">
              <DefaultCounterCard
                class="counter-card black-card"
                color="dark"
                title="Total Posts"
                description="Explore the variety of posts shared by others."
                :count="photoSpotStore.totalPosts"
                :duration="3000"
              />
            </div>
            <!-- 전체 좋아요 수 -->
            <div class="col-md-4 position-relative d-flex">
              <DefaultCounterCard
                class="counter-card red-card"
                color="danger"
                title="Total Likes"
                description="See how many likes posts have received."
                :count="photoSpotStore.totalLikes"
                suffix="❤️"
                :duration="4000"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 각 카드 높이 맞춤을 위한 기본 스타일 */
.counter-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 200px; /* 높이 일관성을 위해 추가 */
}

.counter-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* 검정 계열 카드 스타일 */
.black-card {
  background-color: #333;
  color: #fff;
}

.black-card h5, .black-card h6 {
  color: #fff;
}

/* 빨간 계열 카드 스타일 */
.red-card {
  background-color: #e74c3c;
  color: #fff;
}

.red-card h5, .red-card h6 {
  color: #fff;
}

.section-header {
  color: #333;
}

</style>
