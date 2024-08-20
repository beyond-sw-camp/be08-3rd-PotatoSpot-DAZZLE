<template>
  <div class="gallery-container">
    <div class="image-gallery">
      <div v-for="(imageUrl, index) in visibleImages" :key="index" class="image-wrapper"  data-aos="zoom-in">
        <img 
          :src="imageUrl" 
          :alt="`Thumbnail ${index + 1}`" 
          class="gallery-image" 
          @click="redirectToKakaoMap"
          style="cursor: pointer;"
        />
      </div>
    </div>

    <!-- Pagination Component -->
    <section class="py-7">
      <div class="container">
        <div class="row justify-space-between py-2">
          <div class="col-lg-4 mx-auto">
            <MaterialPagination>
              <MaterialPaginationItem
                prev
                class="ms-auto"
                :disabled="currentPage === 0"
                @click="prev"
              />
              <MaterialPaginationItem
                v-for="page in totalPages"
                :key="page"
                :label="page"
                :active="currentPage === page - 1"
                @click="goToPage(page - 1)"
              />
              <MaterialPaginationItem
                next
                :disabled="isLastPage"
                @click="next"
              />
            </MaterialPagination>
          </div>
        </div>
      </div>
    </section>

    <Modal
      :isVisible="isModalVisible"
      :images="modalImages"
      :kakaoMapUrl="kakaoMapUrl"
      @close="closeModal"
    />
    
  </div>
</template>

<script>
import { ref as storageRef, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; 

import MaterialPagination from '@/components/MaterialPagination.vue';
import MaterialPaginationItem from '@/components/MaterialPaginationItem.vue';

export default {
  name: 'ImageThumbnails',
  components: {
    MaterialPagination,
    MaterialPaginationItem
  },
  data() {
    return {
      imagesPerPage: 9, 
      currentPage: 0,    
      imageUrls: [],     
      totalImages: 0,    
    };
  },
  computed: {
    visibleImages() {
      const start = this.currentPage * this.imagesPerPage;
      const end = start + this.imagesPerPage;
      return this.imageUrls.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.totalImages / this.imagesPerPage);
    },
    isLastPage() {
      return this.currentPage + 1 >= this.totalPages;
    }
  },
  async created() {
    await this.fetchImages(); // Fetch images 
  },
  methods: {
    async fetchImages() {
      try {
        const listRef = storageRef(storage, "images/"); 
        const res = await listAll(listRef);

        
        const urls = await Promise.all(res.items.map(item => getDownloadURL(item)));
        this.imageUrls = urls;
        this.totalImages = urls.length;
      } catch (error) {
        console.error("Error fetching images from Firebase:", error);
      }
    },
    redirectToKakaoMap() {
      const kakaoMapUrl = "https://m.map.kakao.com/actions/searchView?q=%EA%B0%95%EC%9B%90%EB%8F%84%20%EA%B0%95%EB%A6%89&wxEnc=LVSOTP&wyEnc=QNLTTMN&lvl=4#!/YNMNMP,QNVPOPV/map/place";
      window.location.href = kakaoMapUrl;
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
  background-color: #ffffff;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3x3 grid */
  gap: 30px; 
  width: 100%;
  max-width: 1200px; 
}

.image-wrapper {
  width: 100%;
  height: 200px; 
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease-in-out;
}

.image-wrapper:hover {
  transform: translateY(-10px); 
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* 섀도우 */
  z-index: 1; 
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  display: block;
}
</style>
