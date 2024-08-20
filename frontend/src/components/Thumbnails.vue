<template>
  <div class="gallery-container">
    <h2>Recently added Photos</h2><br>
    <div class="image-gallery">
      <div v-for="(spot, index) in visibleSpots" :key="spot.id" class="image-wrapper" data-aos="zoom-in">
        <img 
          :src="spot.imgUrl" 
          :alt="`Thumbnail ${index + 1}`" 
          class="gallery-image" 
          @click="openDetailsModal(spot.id)"
          style="cursor: pointer;"
        />
      </div>
    </div>

    <DetailsSpotModal 
      v-if="selectedPostId !== null" 
      :post-id="selectedPostId" 
      @close="closeDetailsModal"
    />
    
    <div class="pagination-container">
      <span class="material-symbols-outlined pagination-arrow" @click="prev" :class="{ disabled: currentPage === 0 }">
        keyboard_double_arrow_left
      </span>

      <MaterialPagination>
        <MaterialPaginationItem
          v-for="page in totalPages"
          :key="page"
          :label="String(page)"
          :active="currentPage === page - 1"
          @click="goToPage(page - 1)"
        />
      </MaterialPagination>

      <span class="material-symbols-outlined pagination-arrow" @click="next" :class="{ disabled: isLastPage }">
        keyboard_double_arrow_right
      </span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { usePhotoSpotStore } from '@/stores/photoSpotStore';
import MaterialPagination from '@/components/MaterialPagination.vue';
import MaterialPaginationItem from '@/components/MaterialPaginationItem.vue';
import DetailsSpotModal from "./DetailsSpotModal.vue";

export default {
  name: 'ImageThumbnails',
  components: {
    MaterialPagination,
    MaterialPaginationItem,
    DetailsSpotModal
  },
  data() {
    return {
      imagesPerPage: 9, 
      currentPage: 0,    
      selectedPostId: null   
    };
  },
  computed: {
    photoSpotStore() {
      return usePhotoSpotStore();
    },
    visibleSpots() {
      const start = this.currentPage * this.imagesPerPage;
      const end = start + this.imagesPerPage;
      return this.photoSpotStore.photoSpots.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.photoSpotStore.photoSpots.length / this.imagesPerPage);
    },
    isLastPage() {
      return this.currentPage + 1 >= this.totalPages;
    }
  },
  async created() {
    await this.photoSpotStore.fetchPhotoSpots(); // Fetch photo spots from Firestore
  },
  methods: {
    openDetailsModal(postId) {
      this.selectedPostId = postId;
    },
    closeDetailsModal() {
      this.selectedPostId = null;
    },
    next() {
      if (!this.isLastPage) {
        this.currentPage++;
      }
    },
    prev() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    }
  }
}
</script>

<style scoped>
.gallery-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  padding: 30px;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3x3 grid */
  gap: 40px; 
  width: 100%;
  max-width: 1200px;
  
}

.image-wrapper {
  width: 100%;
  height: 200px; 
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Slightly longer transition for better effect */
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); 
}

.image-wrapper:hover {
  transform: translateY(-8px); /* Adjusted for a subtler effect */
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  display: block;
  border-radius: 15px;
}
.pagination-container {
  display: flex;
  margin-top: 40px;
}

.pagination-arrow {
  cursor: pointer;
  font-size: 30px; 
  margin: 0 10px; 
}

.pagination-arrow.disabled {
  cursor: not-allowed;
  color: #ccc; 
}

.modal-overlay {
  position: absolute; /* Change from fixed to absolute */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2; /* Ensure it is above other content */
}

.modal-content {
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  width: 80%; /* Adjust as needed */
  max-height: 80vh; /* Ensure it fits within viewport */
  overflow-y: auto;
  padding: 20px;
  position: relative;
}
</style>

