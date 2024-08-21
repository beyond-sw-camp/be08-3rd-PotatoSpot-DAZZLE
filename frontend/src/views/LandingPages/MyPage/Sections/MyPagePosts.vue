<template>
  <section class="photospot-section py-3">
    <div class="container">
      <div class="row section-header">
        <h3 class="mb-3 text-center">내 포토스팟</h3>
      </div>
      <div class="row mt-4">
        <div 
          class="col-md-4 col-sm-6 mb-4 d-flex justify-content-center" 
          v-for="photospot in filteredPhotoSpots"
          :key="photospot.id"
          data-aos="zoom-in"             
          data-aos-delay="100"            
          data-aos-duration="500">        
          
          <PostCard 
            class="photospot-card" 
            :image="photospot.imgUrl" 
            :title="photospot.title" 
            :postId="photospot.id"
            @card-clicked="handleCardClick(photospot.id)" 
          />
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
import AOS from 'aos';

const photoSpotStore = usePhotoSpotStore();
const userStore = useUserStore();
const emit = defineEmits(['open-details-spot-modal']);

onMounted(async () => {
  await photoSpotStore.fetchPhotoSpots();
  AOS.refresh();
});

const handleCardClick = (postId) => {
  emit('open-details-spot-modal', postId);
};

const filteredPhotoSpots = computed(() => {
  return photoSpotStore.photoSpots.filter(
    photospot => photospot.userEmail === userStore.userEmail
  );
});
</script>

<style scoped>
.photospot-section {
  color: #333;
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
  max-width: 350px;
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.photospot-card:hover {
  transform: translateY(-5px);
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
