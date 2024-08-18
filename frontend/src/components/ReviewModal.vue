<script setup>
import { ref } from 'vue';
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import { useUserStore } from '../stores/userStore';
import { postReview } from '../utils/utilsDb';




const emit = defineEmits(['close']);
const userStore = useUserStore();

const content = ref('');
const postId = ref('');



const closeModal = () => {
    emit('close');
};

const handleSubmit = async () => {
    console.log('Content:', content.value);
    // 리뷰 작성 로직을 여기에 추가하세요.
    if (content.value != '') {
        await postReview('001', userStore.userEmail, content.value);
        alert('리뷰가 등록되었습니다.')
        closeModal();
    } else {
        alert('리뷰 내용을 입력해주세요!');
    }
};
</script>

<template>
    <div class="modal fade show" tabindex="-1" style="display: block;" aria-modal="true" role="dialog"
        @click.self="closeModal">
        <div class="modal-dialog modal-dialog-centered" @click.stop>
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">리뷰 작성</h5>
                </div>
                <div class="modal-body">
                    <form role="form" class="text-start" @submit.prevent="handleSubmit">
                        <div class="mb-3">
                            <textarea v-model="content" class="form-control" placeholder="내용을 입력하세요"
                                rows="5"></textarea>
                        </div>
                        <div class="text-center">
                            <MaterialButton class="my-4 mb-2" variant="gradient" color="secondary" fullWidth
                                type="submit">
                                리뷰 등록
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
