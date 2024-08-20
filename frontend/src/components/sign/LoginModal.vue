<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
import { loginUser } from '../../utils/utilsAuth';
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialSwitch from "@/components/MaterialSwitch.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { useUserStore } from '../../stores/userStore';

const emit = defineEmits(['close', 'signupModal']);

const email = ref('');
const password = ref('');
const firebaseUser = ref(null);
const userStore = useUserStore();

onAuthStateChanged(auth, user => {
  firebaseUser.value = user;
});

const closeModal = () => {
  emit('close');
};

const openSignupModal = () => {
  emit('signupModal');
  closeModal();
};

const handleSubmit = async () => {
  console.log(email.value);
  console.log(password.value);
  if (email.value != '' && password.value != '') {
    await loginUser(email.value, password.value);
    if (auth.currentUser.isAnonymous) {
      alert('로그인 실패');
    } else {
      alert('로그인 Email : ' + email.value);
      emit('close');
    }
  } else {
    alert('정보를 모두 입력해주세요.');
  }

};
</script>

<template>
  <div class="modal fade show modal-fade-in" tabindex="-1" style="display: block;" aria-modal="true" role="dialog"
    @click="closeModal">
    <div class="modal-dialog modal-dialog-centered" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">로그인</h5>
        </div>
        <div class="modal-body">
          <form role="form" class="text-start" @submit.prevent="handleSubmit">
            <MaterialInput v-model="email" class="input-group-dynamic mb-2" placeholder="Email" type="email" />
            <MaterialInput v-model="password" class="input-group-dynamic mb-2" placeholder="Password" type="password" />
            <MaterialSwitch class="d-flex align-items-center mb-3" id="rememberMe" labelClass="mb-0 ms-3">
              로그인 정보 기억
            </MaterialSwitch>

            <div class="text-center">
              <MaterialButton class="my-4 mb-2" variant="gradient" color="info" fullWidth type="submit">
                Login
              </MaterialButton>
            </div>
            <p class="mt-4 text-sm text-center">
              회원 정보가 없으신가요?
              <a href="#" class="text-info text-gradient font-weight-bold" @click.prevent="openSignupModal">회원 가입</a>
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
