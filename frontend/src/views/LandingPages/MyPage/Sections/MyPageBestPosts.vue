<template>
  <section v-if="firebaseUser && bestPosts.length > 0" class="best-posts-section py-3">
    <div class="container">
      <div class="row section-header">
        <h3 class="mb-3 text-center">인기 포토스팟</h3>
      </div>
      <div class="row">
        <div 
          v-for="(post, index) in bestPosts" 
          :key="post.id"
          class="col-lg-3 col-sm-6 d-flex justify-content-center mb-6 position-relative"
          data-aos="fade-up"              
          :data-aos-delay="index * 200" 
          data-aos-duration="800"          
        >
          <div class="card-container">
            <LikeCounter class="like-counter position-absolute" color="danger" :count="post.likes" suffix="♥️"
              :duration="3000" />
            <RotatingCard class="rotating-card">
              <RotatingCardFront :image="post.imgUrl" />
              <RotatingCardBack :image="post.imgUrl" :title="post.title" :description="post.content" :action="[
                {
                  spotId: post.id,
                  label: 'Detail Spot',
                },
              ]" @card-clicked="handleCardClick(post.id)" />
            </RotatingCard>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, computed, defineEmits } from 'vue';
import RotatingCard from '../components/RotatingCard.vue';
import RotatingCardFront from "../components/RotatingCardFront.vue";
import RotatingCardBack from '../components/RotatingCardBack.vue';
import LikeCounter from "../components/LikeCounter.vue";
import { usePhotoSpotStore } from '../../../../stores/photoSpotStore';
import { useUserStore } from '../../../../stores/userStore';
import AOS from 'aos';

const photoSpotStore = usePhotoSpotStore();
const userStore = useUserStore();
const firebaseUser = ref(userStore.firebaseUser);
const emit = defineEmits(['open-details-spot-modal2']);

const handleCardClick = (postId) => {
  console.log(postId);
  emit('open-details-spot-modal2', postId);
};

const fetchPosts = async () => {
  await photoSpotStore.fetchPhotoSpots();
  console.log(photoSpotStore.photoSpots);
};

onMounted(async () => {
  await fetchPosts();
  AOS.refresh();
});

watch(
  () => userStore.firebaseUser,
  async (newUser, oldUser) => {
    if (newUser !== oldUser) {
      firebaseUser.value = newUser;
      await fetchPosts();
    }
  }
);

const filteredPhotoSpots = computed(() => {
  return photoSpotStore.photoSpots.filter(
    photospot => photospot.userEmail === userStore.userEmail
  );
});

const bestPosts = computed(() => {
  if (!firebaseUser.value) return [];
  return filteredPhotoSpots.value
    .slice()
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 4);
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
