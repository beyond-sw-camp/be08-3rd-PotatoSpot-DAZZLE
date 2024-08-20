<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import { registerUser } from '../../utils/utilsAuth';  // 유틸리티 함수에서 registerUser 사용

const emit = defineEmits(['close']);

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const imageFile = ref(null);  // 이미지 파일을 저장할 ref

const closeModal = () => {
  emit('close');
};

const openLoginModal = () => {
  emit('loginModal');
  closeModal();
};

const handleImageUpload = (event) => {
  imageFile.value = event.target.files[0];  // 선택된 이미지 파일을 저장
};

const handleSubmit = async () => {
  console.log('Name:', name.value);
  console.log('Email:', email.value);
  console.log('Password:', password.value);
  console.log('Confirm Password:', confirmPassword.value);
  if (name.value !== '' && email.value !== '' && password.value !== '' && confirmPassword.value !== '' && imageFile.value) {
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
  <div class="modal fade show" tabindex="-1" style="display: block;" aria-modal="true" role="dialog"
    @click="closeModal">
    <div class="modal-dialog modal-dialog-centered" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">회원가입</h5>
        </div>
        <div class="modal-body">
          <form role="form" class="text-start" @submit.prevent="handleSubmit">
            <MaterialInput v-model="name" class="input-group-dynamic mb-2" placeholder="이름" type="text" />
            <MaterialInput v-model="email" class="input-group-dynamic mb-2" placeholder="이메일" type="email" />
            <MaterialInput v-model="password" class="input-group-dynamic mb-2" placeholder="비밀번호" type="password" />
            <MaterialInput v-model="confirmPassword" class="input-group-dynamic mb-2" placeholder="비밀번호 확인"
              type="password" />
            
            <!-- 프로필 이미지 업로드 -->
            <input type="file" @change="handleImageUpload" accept="image/*" class="form-control mb-3" />

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
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
