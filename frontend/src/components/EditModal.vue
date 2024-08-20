<script setup>
import { ref } from "vue";
import MaterialButton from "@/components/MaterialButton.vue";
import { useUserStore } from '../stores/userStore';
import { updateUserProfile } from '../utils/utilsAuth'; // 프로필 업데이트 함수 추가

const emit = defineEmits(['close']);
const userStore = useUserStore();

// 사용자 이름과 프로필 이미지 초기화
const updatedName = ref(userStore.userName);
const updatedImage = ref(null); // 새로 업로드할 이미지 파일

const closeModal = () => {
  emit('close');
};

// 이미지 파일 선택 처리
const handleImageUpload = (event) => {
  updatedImage.value = event.target.files[0];
};

const handleSubmit = async () => {
  // 이름과 프로필 이미지 업데이트
  try {
    await updateUserProfile(userStore.firebaseUser, updatedName.value, updatedImage.value);
    alert('프로필이 업데이트되었습니다.');
    closeModal();
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('프로필 업데이트 중 오류가 발생했습니다.');
  }
};
</script>

<template>
  <div class="modal fade show" tabindex="-1" style="display: block;" aria-modal="true" role="dialog" @click.self="closeModal">
    <div class="modal-dialog modal-dialog-centered" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Profile</h5>
        </div>
        <div class="modal-body">
          <form role="form" class="text-start" @submit.prevent="handleSubmit">
            <div class="mb-3 text-center">
              <img :src="userStore.profilePic" alt="Current Profile Picture" class="img-fluid rounded-circle mb-3" width="150" height="150"/>
              <input type="file" @change="handleImageUpload" accept="image/*" class="form-control"/>
            </div>
            <div class="mb-3">
              <input v-model="updatedName" type="text" class="form-control" placeholder="이름을 입력하세요"/>
            </div>
            <div class="text-center">
              <MaterialButton class="my-4 mb-2" variant="gradient" color="secondary" fullWidth type="submit">
                Save Changes
              </MaterialButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
