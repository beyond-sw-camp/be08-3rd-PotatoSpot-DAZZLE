<template>
  <div class="gallery-container">
    <h2>Recently added Photos</h2>
    <br />
    <div class="image-gallery">
      <div
        v-for="(spot, index) in visibleSpots"
        :key="spot.id"
        class="image-wrapper"
        data-aos="zoom-in"
      >
        <img
          :src="spot.imgUrl"
          :alt="`Thumbnail ${index + 1}`"
          class="gallery-image"
          @click="handlerClicked(spot.id)"
          style="cursor: pointer"
        />
      </div>
    </div>

    <div class="pagination-container">
      <span
        class="material-symbols-outlined pagination-arrow"
        @click="prev"
        :class="{ disabled: currentPage === 0 }"
      >
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

      <span
        class="material-symbols-outlined pagination-arrow"
        @click="next"
        :class="{ disabled: isLastPage }"
      >
        keyboard_double_arrow_right
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from "vue";
import { usePhotoSpotStore } from "@/stores/photoSpotStore";
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";

const imagesPerPage = ref(9);
const currentPage = ref(0);
const emit = defineEmits(["open-details-spot-modal3"]);
const photoSpotStore = usePhotoSpotStore();

const visibleSpots = computed(() => {
  const start = currentPage.value * imagesPerPage.value;
  const end = start + imagesPerPage.value;
  return photoSpotStore.photoSpots.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(photoSpotStore.photoSpots.length / imagesPerPage.value);
});

const isLastPage = computed(() => {
  return currentPage.value + 1 >= totalPages.value;
});

const handlerClicked = (postId) => {
  console.log(postId);
  emit("open-details-spot-modal3", postId);
};

const next = () => {
  if (!isLastPage.value) {
    currentPage.value++;
  }
};

const prev = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

onMounted(async () => {
  await photoSpotStore.fetchPhotoSpots();
  setTimeout(() => {
    document.querySelectorAll(".image-wrapper").forEach((element) => {
      element.addEventListener("mouseenter", () => {
        element.style.transform = "translateY(-8px)";
        element.style.boxShadow = "0 6px 18px rgba(0, 0, 0, 0.35)";
      });
      element.addEventListener("mouseleave", () => {
        element.style.transform = "translateY(0)";
        element.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.3)";
      });
    });
  }, 100); // AOS 애니메이션 완료 후 타이밍 조정
});
</script>

<style>
/* 여기서 scoped를 제거하고 테스트해 보세요 */
.gallery-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.modal-content {
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  width: 80%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  position: relative;
}
</style>
