<template>
  <div class="modal fade show modal-fade-in" tabindex="-1" style="display: block" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ selectPlaceName }}</h5>
          <button @click="closeModal" class="close-button">X</button>
        </div>
        <div class="modal-body d-flex">
          <!-- 왼쪽: 포토스팟 리스트 -->
          <div class="left-section">
            <h6>Photo Spots</h6>
            <ul v-if="filteredPhotoSpots.length">
              <li v-for="spot in filteredPhotoSpots" :key="spot.id" @click="viewDetail(spot.id)">
                <div class="spot-card">
                  <img :src="spot.imgUrl" alt="포토스팟 이미지" class="spot-image" />
                  <div class="spot-info">
                    <p class="spot-title">{{ spot.title }}</p>
                    <button @click.stop="incrementLike(spot.id)" class="like-button">
                      <span class="like-count">{{ spot.likes }}</span>
                      <span class="heart-icon">&#10084;</span>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
            <p v-else class="no-photo-spots-message">
              첫 포토스팟을 등록해보세요!!
            </p>
          </div>
          <!-- 오른쪽: 마커 정보 -->
          <div class="right-section">
            <h6>Spot Info</h6>
            <p><strong>위도:</strong> {{ selectY }}</p>
            <p><strong>경도:</strong> {{ selectX }}</p>
            <p><strong>주소:</strong> {{ selectPlaceAddr }}</p>
            <p><strong>장소명:</strong> {{ selectPlaceName }}</p>
            <MaterialButton class="register-button mt-auto" variant="gradient" color="dark" fullWidth
              @click="registerPhotoSpot">
              Add a photo spot
            </MaterialButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import MaterialButton from "@/components/MaterialButton.vue";
import { usePhotoSpotStore } from "@/stores/photoSpotStore";
import { incrementLikes } from "@/utils/utilsDb";
import { useUserStore } from "../stores/userStore";

const props = defineProps({
  x: String,
  y: String,
  location: String,
  address: String,
});

const emit = defineEmits(["close", "view"]);
const photoSpotStore = usePhotoSpotStore();
const userStore = useUserStore();
const filteredPhotoSpots = computed(() => {
  return photoSpotStore.photoSpots
    .filter((spot) => spot.addr === props.address)
    .sort((a, b) => b.likes - a.likes);
});

const selectX = ref(props.x);
const selectY = ref(props.y);
const selectPlaceName = ref(props.location);
const selectPlaceAddr = ref(props.address);

const incrementLike = async (spotId) => {
  if (userStore.firebaseUser === null) {
    alert("로그인 후 이용해주세요!");
  } else {
    try {
      await incrementLikes(spotId);
      photoSpotStore.fetchPhotoSpots();

    } catch (error) {
      console.error("Error incrementing like:", error);
    }
  }
};

const closeModal = () => {
  emit("close");
};

const registerPhotoSpot = () => {
  if(userStore.firebaseUser === null){
    alert('로그인 후 이용해주세요!');
  }else{
    emit("postPhotoSpot");
  }
};

const viewDetail = (spotId) => {
  emit("showDetailSpot", spotId);
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
}

/* 애니메이션 효과 추가 */
.modal-fade-in {
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.modal-dialog {
  max-width: 1200px;
  width: 100%;
  height: 80vh;
  /* 모달의 높이를 80vh로 설정하여 스크롤이 가능하도록 함 */
}

.modal-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 1rem;
  background-color: #f8f9fa;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #000000;
  transition: color 0.3s;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  display: flex;
  justify-content: space-between;
  flex: 1;
  padding: 1rem;
  overflow: hidden;
}

.left-section {
  flex: 3;
  margin-right: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.left-section h6 {
  margin-bottom: 10px;
  font-weight: bold;
  color: #555;
}

.left-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.left-section li {
  margin-bottom: 10px;
}

.spot-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.spot-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.spot-image {
  width: 95%;
  height: 300px;
  margin: 20px;
  border-radius: 10px;
  object-fit: cover;
  align-self: center;
}

.spot-info {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spot-title {
  font-weight: bold;
  color: #333;
}

.like-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #e74c3c;
}

.like-button:hover {
  color: #c0392b;
}

.like-count {
  margin-right: 5px;
  font-weight: bold;
}

.right-section {
  flex: 1;
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* 버튼을 하단에 위치시키기 위한 설정 */
}

.right-section h6 {
  font-weight: bold;
  margin-bottom: 10px;
  color: #555;
}

.right-section p {
  margin: 0 0 10px 0;
  color: #333;
}

.register-button {
  background-color: #2c3e50;
  color: white;
  font-weight: 600;
  padding: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}

.register-button:hover {
  background-color: #34495e;
}

.no-photo-spots-message {
  font-size: 2rem;
  font-style: unset;
  font-weight: 600;
  color: #888;
  text-align: center;
  margin-top: 30px;
}
</style>
