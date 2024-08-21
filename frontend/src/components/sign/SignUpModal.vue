<script setup>
import { ref } from 'vue';
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import { registerUser } from '../../utils/utilsAuth';
import { useRouter } from 'vue-router';

const emit = defineEmits(['close', 'loginModal']);
const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const imageFile = ref(null);
const imagePreview = ref(''); // 이미지 미리보기 URL

const closeModal = () => {
  emit('close');
};

const openLoginModal = () => {
  emit('loginModal');
  closeModal();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file); // 미리보기 URL 생성
  }
};

const handleImageRemove = () => {
  imageFile.value = null;
  imagePreview.value = ''; // 미리보기 제거
  URL.revokeObjectURL(imagePreview.value); // 메모리 해제
};

const handleSubmit = async () => {
  if (password.value.length < 6) {
    alert('비밀번호는 6자리 이상이어야 합니다.');
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    return;
  }

  if (name.value && email.value && password.value && confirmPassword.value && imageFile.value) {
    try {
      await registerUser(email.value, password.value, name.value, imageFile.value);
      alert(name.value + '님 환영합니다!');
      closeModal();
      router.go(0);
    } catch (error) {
      console.error('Error during registration:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  } else {
    alert('모든 정보를 입력해주세요.');
  }
};
</script>

<template>
  <div class="modal fade show modal-fade-in" tabindex="-1" style="display: block;" aria-modal="true" role="dialog"
    @click="closeModal">
    <div class="modal-dialog modal-dialog-centered modal-custom" @click.stop>
      <div class="modal-content rounded-lg p-4">
        <div class="modal-header border-0">
          <h5 class="modal-title">Sign Up</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form role="form" class="text-start" @submit.prevent="handleSubmit">
            <MaterialInput v-model="name" class="input-group-dynamic mb-3" placeholder="Name" type="text" />
            <MaterialInput v-model="email" class="input-group-dynamic mb-3" placeholder="Email" type="email" />
            <MaterialInput v-model="password" class="input-group-dynamic mb-3" placeholder="Password" type="password" />
            <MaterialInput v-model="confirmPassword" class="input-group-dynamic mb-3" placeholder="Confirm Password"
              type="password" />

            <!-- 프로필 이미지 업로드 및 미리보기 -->
            <div class="mb-3 text-center">
              <div class="d-flex flex-column align-items-center">
                <div v-if="imagePreview" class="position-relative">
                  <img :src="imagePreview" alt="Profile Preview"
                    class="img-fluid rounded-circle profile-pic-preview mb-2" />
                </div>
                <div v-else>
                  <div class="img-fluid rounded-circle profile-pic-placeholder mb-2"></div>
                </div>

                <!-- 이미지 선택 버튼 -->
                <button type="button" class="btn btn-outline-secondary mb-2" @click="$refs.fileInput.click()">Choose
                  Photo</button>
                <input type="file" @change="handleImageUpload" accept="image/*" class="form-control d-none"
                  ref="fileInput" />

                <!-- 이미지 취소 버튼 -->
                <button v-if="imagePreview" type="button" class="btn btn-outline-danger"
                  @click="handleImageRemove">Cancel</button>
              </div>
            </div>

            <div class="text-center">
              <MaterialButton class="my-4 mb-2" variant="gradient" color="success" fullWidth type="submit">
                Sign Up
              </MaterialButton>
            </div>
            <p class="mt-4 text-sm text-center">
              Already have an account?
              <a href="#" class="text-info text-gradient font-weight-bold" @click.prevent="openLoginModal">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.6);
}

.modal-custom {
  max-width: 500px;
  width: 100%;
}

.modal-content {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  background-color: #f7f9fc;
}

.modal-header {
  background-color: #f8f9fa;
  border-bottom: none;
  padding: 1rem 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
}

.profile-pic-preview,
.profile-pic-placeholder {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 3px solid #ddd;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-pic-placeholder {
  background-color: white;
  border-radius: 50%;
}

.btn-outline-secondary {
  color: #333;
  border-color: #ccc;
  padding: 0.5rem 1.25rem;
}

.btn-outline-secondary:hover {
  background-color: #e9ecef;
  border-color: #bbb;
}

.btn-outline-danger {
  padding: 0.4rem 1rem;
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

.text-gradient {
  background: -webkit-linear-gradient(#007bff, #6610f2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
