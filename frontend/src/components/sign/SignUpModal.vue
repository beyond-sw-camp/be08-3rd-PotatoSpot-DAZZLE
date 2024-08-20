<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import { registerUser } from '../../utils/utilsAuth';

const emit = defineEmits(['close', 'loginModal']);

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
  <div class="modal fade show modal-fade-in" tabindex="-1" style="display: block;" aria-modal="true" role="dialog" @click="closeModal">
    <div class="modal-dialog modal-dialog-centered" @click.stop>
      <div class="modal-content rounded-lg p-4">
        <div class="modal-header border-0">
          <h5 class="modal-title">회원가입</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form role="form" class="text-start" @submit.prevent="handleSubmit">
            <MaterialInput v-model="name" class="input-group-dynamic mb-2" placeholder="이름" type="text" />
            <MaterialInput v-model="email" class="input-group-dynamic mb-2" placeholder="이메일" type="email" />
            <MaterialInput v-model="password" class="input-group-dynamic mb-2" placeholder="비밀번호" type="password" />
            <MaterialInput v-model="confirmPassword" class="input-group-dynamic mb-2" placeholder="비밀번호 확인" type="password" />

            <!-- 프로필 이미지 업로드 및 미리보기 -->
            <div class="mb-3 text-center">
              <input type="file" @change="handleImageUpload" accept="image/*" class="form-control d-none" ref="fileInput" />
              <div v-if="imagePreview" class="position-relative">
                <img :src="imagePreview" alt="Profile Preview" class="img-thumbnail mb-2" style="max-width: 150px; max-height: 150px;" />
                <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0" @click="handleImageRemove">X</button>
              </div>
              <div v-else>
                <button type="button" class="btn btn-outline-secondary" @click="$refs.fileInput.click()">프로필 사진 선택</button>
              </div>
            </div>

            <div class="text-center">
              <MaterialButton class="my-4 mb-2" variant="gradient" color="success" fullWidth type="submit">
                회원가입
              </MaterialButton>
            </div>
            <p class="mt-4 text-sm text-center">
              이미 회원이신가요?
              <a href="#" class="text-info text-gradient font-weight-bold" @click.prevent="openLoginModal">로그인</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-content {
  background-color: #f7f9fc;
}

.modal-title {
  font-weight: bold;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
}

.img-thumbnail {
  border-radius: 50%;
  object-fit: cover;
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

.btn-danger {
  padding: 0.2rem 0.4rem;
  font-size: 0.8rem;
}

.text-gradient {
  background: -webkit-linear-gradient(#007bff, #6610f2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
</style>
