<template>
  <section class="py-3">
    <div class="container">
      <div class="row" style="border-bottom: 1px solid lightgray;">
        <h3 class="mb-3">내 포토스팟</h3>
      </div>
      <div class="container mt-sm-3 mt-3 row">
        <div class="col-md-3 mt-md-4" v-for="photospot in filteredPhotoSpots" :key="photospot.id">
          <PostCard :image="photospot.imgUrl" :title="photospot.title" :postId="photospot.id"
            @card-clicked="handleCardClick(photospot.id)" />
        </div>
      </div>
      <!-- 모달 컴포넌트 렌더링 -->
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
