<template>
  <section class="photospot-section py-3">
    <div class="container">
      <div class="row section-header">
        <h3 class="mb-3 text-center">내 포토스팟</h3>
      </div>
      <div class="row mt-4">
        <div class="col-md-4 col-sm-6 mb-4 d-flex justify-content-center" v-for="photospot in filteredPhotoSpots" :key="photospot.id">
          <PostCard class="photospot-card" :image="photospot.imgUrl" :title="photospot.title" :postId="photospot.id"
            @card-clicked="handleCardClick(photospot.id)" />
        </div>
      </div>
      <DetailsSpotModal v-if="showModalDetailsSpot" :post-id="selectedPostId" @close="closeDetailsSpotModal" />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import PostCard from '../components/PostCard.vue';
import DetailsSpotModal from '../../../../components/DetailsSpotModal.vue'; // 모달 컴포넌트 임포트
import { usePhotoSpotStore } from '../../../../stores/photoSpotStore';
import { useUserStore } from '../../../../stores/userStore';

const photoSpotStore = usePhotoSpotStore();
const userStore = useUserStore();

const showModalDetailsSpot = ref(false); // 모달 표시 여부
const selectedPostId = ref(null); // 선택된 게시글 ID

onMounted(async () => {
  await photoSpotStore.fetchPhotoSpots(); // 데이터 로드
  console.log(photoSpotStore.photoSpots); // 콘솔에 출력하여 데이터 확인
});

// 포스트 카드 클릭 시 모달을 여는 함수
const handleCardClick = (postId) => {
  openDetailsSpotModal(postId); // 모달 열기
};

const openDetailsSpotModal = (postId) => {
  selectedPostId.value = postId; // 선택된 포스트 ID 설정
  showModalDetailsSpot.value = true; // 모달 표시
};

const closeDetailsSpotModal = () => {
  showModalDetailsSpot.value = false; // 모달 닫기
  selectedPostId.value = null; // 선택된 포스트 ID 초기화
};

// 사용자의 게시물 필터링
const filteredPhotoSpots = computed(() => {
  return photoSpotStore.photoSpots.filter(
    photospot => photospot.userEmail === userStore.userEmail
  );
});
</script>

<style scoped>
.photospot-section {
  color: white;
  padding-bottom: 50px;
  border-radius: 10px;
}

.section-header {
  border-bottom: 2px solid lightgray;
  padding-bottom: 10px;
}

.section-header h3 {
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
  color: #333;
}

.photospot-card {
  width: 100%;
  max-width: 350px; /* 카드의 최대 너비 설정 */
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.photospot-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.photospot-card img {
  border-radius: 10px;
}

.photospot-card .PostCard-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-top: 10px;
  text-align: center;
}
</style>
