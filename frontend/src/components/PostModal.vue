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
const image = ref("");
const imgUrl = ref("");
const inputLocation = ref(''); // 새로 추가한 ref

const getKoreanFormattedDate = () => {
  return new Date().toISOString(); // ISO 8601 형식의 문자열 반환
};

const closeModal = () => {
  const modalElement = document.querySelector('.modal');
  
  modalElement.classList.remove('show');
  
  setTimeout(() => {
    emit("close");
  }, 300);
};

const handleImageUpload = (event) => {
  image.value = event.target.files[0];
  console.log("Selected image:", image.value);
};

const handleSubmit = async () => {
  console.log("Title:", title.value);
  console.log("Content:", content.value);
  console.log("Image:", image.value);

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
  <div class="modal fade show" tabindex="-1" style="display: block" aria-modal="true" role="dialog" @click="closeModal">
    <div class="modal-dialog modal-dialog-centered" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">포토스팟 등록</h5>
        </div>
        <div class="modal-body">
          <form role="form" class="text-start" @submit.prevent="handleSubmit">
            <div v-if="location === '장소 없음'">
              <MaterialInput v-model="inputLocation" class="input-group-dynamic mb-2" placeholder="장소 명" type="text" />
            </div>
            <MaterialInput v-model="title" class="input-group-dynamic mb-2" placeholder="제목" type="text" />
            <div class="mb-3">
              <textarea v-model="content" class="form-control" placeholder="내용을 입력하세요" rows="5"></textarea>
            </div>
            <div class="mb-3">
              <label for="imageUpload" class="form-label">사진 업로드</label>
              <input class="form-control" type="file" id="imageUpload" @change="handleImageUpload" />
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
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.modal.show {
  animation-name: fadeIn;
}
</style>

