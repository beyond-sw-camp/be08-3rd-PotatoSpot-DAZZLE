<script setup>
import { ref } from "vue";
import { defineEmits, defineProps } from "vue";
import { useRouter } from 'vue-router';
import MaterialInput from '@/components/MaterialInput.vue';
import MaterialButton from "@/components/MaterialButton.vue";
import { uploadImage } from "../utils/utilsStorage";
import { postPhotoSpot } from "../utils/utilsDb";
import { useUserStore } from "../stores/userStore";
import { usePhotoSpotStore } from '../stores/photoSpotStore';

const props = defineProps({
  x: String,
  y: String,
  location: String,
  address: String,
});

const emit = defineEmits(["close"]);
const userStore = useUserStore();
const photoSpotStore = usePhotoSpotStore();
const router = useRouter();

const title = ref("");
const content = ref("");
const image = ref(null);
const imgUrl = ref("");
const imagePreview = ref("");  // 이미지 미리보기 URL
const inputLocation = ref('');  // 새로 추가한 ref

const getKoreanFormattedDate = () => {
  return new Date().toISOString(); // ISO 8601 형식의 문자열 반환
};

const closeModal = () => {
  emit("close");
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    image.value = file;
    imagePreview.value = URL.createObjectURL(file); // 미리보기 URL 생성
  }
};

const handleImageRemove = () => {
  image.value = null;
  imagePreview.value = ""; // 미리보기 제거
  URL.revokeObjectURL(imagePreview.value); // 메모리 해제
};

const handleSubmit = async () => {
  if (userStore.userEmail) {
    if (title.value && content.value && image.value) {
      try {
        imgUrl.value = await uploadImage(image.value);
        const currentTime = getKoreanFormattedDate();

        const locationValue = props.location === '장소 없음' ? inputLocation.value : props.location;

        const newSpot = await postPhotoSpot(
          userStore.userEmail,
          title.value,
          content.value,
          imgUrl.value,
          locationValue,
          props.address,
          props.x,
          props.y,
          0,
          currentTime
        );

        photoSpotStore.photoSpots.push(newSpot);

        alert('포토스팟이 등록되었습니다.');
        closeModal();
        router.go(0);
      } catch (error) {
        console.error("Error during submission:", error);
        alert("등록 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } else {
      alert("내용을 전부 입력해주세요!");
    }
  } else {
    alert('로그인 후 이용 가능합니다');
  }
};
</script>

<template>
  <div class="modal fade show modal-fade-in" tabindex="-1" style="display: block" aria-modal="true" role="dialog" @click="closeModal">
    <div class="modal-dialog modal-dialog-centered" @click.stop>
      <div class="modal-content rounded-lg shadow-lg">
        <div class="modal-header border-bottom-0">
          <h5 class="modal-title">포토스팟 등록</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form role="form" class="text-start" @submit.prevent="handleSubmit">
            <div v-if="location === '장소 없음'">
              <MaterialInput v-model="inputLocation" class="input-group-dynamic mb-3" placeholder="장소 명" type="text" />
            </div>
            <MaterialInput v-model="title" class="input-group-dynamic mb-3" placeholder="제목" type="text" />
            <div class="mb-3">
              <textarea v-model="content" class="form-control textarea-custom" placeholder="내용을 입력하세요" rows="4"></textarea>
            </div>

            <!-- 사진 업로드 및 미리보기 -->
            <div class="mb-3 text-center">
              <input type="file" @change="handleImageUpload" accept="image/*" class="form-control d-none" ref="fileInput" />
              <div v-if="imagePreview" class="position-relative">
                <img :src="imagePreview" alt="Image Preview" class="img-thumbnail mb-2" style="max-width: 100%; height: auto;" />
                <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0" @click="handleImageRemove">X</button>
              </div>
              <div v-else>
                <button type="button" class="btn btn-outline-primary" @click="$refs.fileInput.click()">사진 선택</button>
              </div>
            </div>

            <div class="text-center">
              <MaterialButton class="my-4 mb-2" variant="gradient" color="success" fullWidth type="submit">
                등록
              </MaterialButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-content {
  background-color: #f8f9fa;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-weight: bold;
  color: #343a40;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
}

.img-thumbnail {
  border-radius: 8px;
  object-fit: cover;
}

.btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
  padding: 0.5rem 1.25rem;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  color: #fff;
}

.btn-danger {
  padding: 0.2rem 0.4rem;
  font-size: 0.8rem;
}

.modal {
  background-color: rgba(0, 0, 0, 0.6);
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

/* 텍스트 영역 커스텀 스타일 */
.textarea-custom {
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 10px;
  background-color: #ffffff;
  transition: border-color 0.3s ease-in-out;
}

.textarea-custom:focus {
  border-color: #80bdff;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
