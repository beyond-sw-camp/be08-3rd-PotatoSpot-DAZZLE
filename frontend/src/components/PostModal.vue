<script setup>
import { ref } from "vue";
import { defineEmits } from "vue";
import { useRouter } from 'vue-router';  // Vue Router의 useRouter 훅 추가
import MaterialInput from '@/components/MaterialInput.vue';
import MaterialButton from "@/components/MaterialButton.vue";
import { uploadImage } from "../utils/utilsStorage";
import { postPhotoSpot } from "../utils/utilsDb";
import { useUserStore } from "../stores/userStore";

const emit = defineEmits(["close"]);
const userStore = useUserStore();
const router = useRouter();  // useRouter 훅 사용

const title = ref("");
const content = ref("");
const image = ref("");
const imgUrl = ref("");

// 한국 시간 포맷팅 함수
const getKoreanFormattedDate = () => {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Seoul'
    };
    const formatter = new Intl.DateTimeFormat('ko-KR', options);
    return formatter.format(new Date());
};

const closeModal = () => {
    emit("close");
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
                await postPhotoSpot(userStore.userEmail, title.value, content.value, imgUrl.value, '장소', '주소', '위치1', '위치2', 0, currentTime);
                alert('포토스팟이 등록되었습니다.');
                closeModal();
                router.push('/mypage');
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
    <div class="modal fade show" tabindex="-1" style="display: block" aria-modal="true" role="dialog"
        @click="closeModal">
        <div class="modal-dialog modal-dialog-centered" @click.stop>
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">글 작성</h5>
                </div>
                <div class="modal-body">
                    <form role="form" class="text-start" @submit.prevent="handleSubmit">
                        <MaterialInput v-model="title" class="input-group-dynamic mb-2" placeholder="제목" type="text" />
                        <div class="mb-3">
                            <textarea v-model="content" class="form-control" placeholder="내용을 입력하세요"
                                rows="5"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="imageUpload" class="form-label">사진 업로드</label>
                            <input class="form-control" type="file" id="imageUpload" @change="handleImageUpload" />
                        </div>

                        <div class="text-center">
                            <MaterialButton class="my-4 mb-2" variant="gradient" color="success" fullWidth
                                type="submit">
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
.modal {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
