<script setup>
import { ref } from "vue";
import MaterialButton from "@/components/MaterialButton.vue";
import { useUserStore } from '../stores/userStore';
import { updateUserProfile } from '../utils/utilsAuth';
import { useRouter } from "vue-router";

const emit = defineEmits(['close']);
const userStore = useUserStore();

const updatedName = ref(userStore.userName);
const updatedImage = ref(null);
const previewImage = ref(userStore.profilePic);
const router = useRouter();

const closeModal = () => {
  emit('close');
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  updatedImage.value = file;

  // 미리보기 이미지 설정
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const resetImage = () => {
  updatedImage.value = null;
  previewImage.value = userStore.profilePic;
};

const handleSubmit = async () => {
  try {
    await updateUserProfile(userStore.firebaseUser, updatedName.value, updatedImage.value);
    alert('프로필이 업데이트되었습니다.');
    closeModal();
    router.go(0);
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('프로필 업데이트 중 오류가 발생했습니다.');
  }
};
</script>

<template>
  <div class="modal fade show modal-fade-in" tabindex="-1" style="display: block;" aria-modal="true" role="dialog"
    @click.self="closeModal">
    <div class="modal-dialog modal-dialog-centered modal-custom">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Profile</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form role="form" class="text-start" @submit.prevent="handleSubmit">
            <div class="mb-3 text-center position-relative">
              <img :src="previewImage" alt="Current Profile Picture"
                class="img-fluid rounded-circle mb-3 profile-pic-preview" />
              <div class="d-flex justify-content-center mt-2">
                <input type="file" @change="handleImageUpload" accept="image/*" class="form-control d-none"
                  id="fileInput" />
                <label for="fileInput" class="btn btn-primary btn-sm me-2">Choose Photo</label>
                <button v-if="updatedImage" type="button" class="btn btn-outline-danger btn-sm"
                  @click="resetImage">Cancel</button>
              </div>
            </div>
            <div class="mb-3">
              <input v-model="updatedName" type="text" class="form-control" placeholder="Enter your name" />
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

.modal-custom {
  max-width: 500px;
  width: 100%;
}

.modal-content {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background-color: #f8f9fa;
  border-bottom: none;
  padding: 1rem 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.profile-pic-preview {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 3px solid #ddd;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.25rem;
}

.btn-close:focus {
  outline: none;
}

.modal-body {
  padding: 2rem 1.5rem;
  background-color: white;
}

.form-control {
  border-radius: 8px;
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  border-color: #6c757d;
  box-shadow: none;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

.modal-fade-in {
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
