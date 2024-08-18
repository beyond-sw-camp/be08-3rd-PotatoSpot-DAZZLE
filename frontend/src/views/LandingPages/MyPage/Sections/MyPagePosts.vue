<template>
  <section class="py-3">
    <div class="container">
      <div class="row">
        <h3 class="mb-0">내 게시물</h3>
      </div>
      <div class="container mt-sm-3 mt-3 row">
        <div class="col-md-3 mt-md-4" v-for="photospot in filteredPhotoSpots" :key="photospot.id">
          <PostCard :image="photospot.imgUrl" :title="photospot.title" :subtitle="photospot.subtitle" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import PostCard from '../components/PostCard.vue';
import { usePhotoSpotStore } from '../../../../stores/photoSpotStore';
import { useUserStore } from '../../../../stores/userStore';

const photoSpotStore = usePhotoSpotStore();
const userStore = useUserStore();

onMounted(async () => {
  await photoSpotStore.fetchPhotoSpots();
  console.log(photoSpotStore.photoSpots); // 콘솔에 출력하여 확인
});

const filteredPhotoSpots = computed(() => {
  return photoSpotStore.photoSpots.filter(photospot => photospot.userEmail === userStore.userEmail);
});
</script>
