<template>
  <div class="modal fade show" tabindex="-1" style="display: block" aria-modal="true" role="dialog" @click="closeModal">
    <div class="modal-dialog modal-dialog-centered modal-xl" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ post.title }}</h5>
          <button @click="likePost" class="like-button">
            <span class="like-count">{{ post.likes + likeCount }}</span>
            <span class="heart-icon">&#10084;</span>
          </button>
        </div>
        <div class="modal-body d-flex">
          <!-- 왼쪽: 게시글 이미지 -->
          <div class="post-image">
            <img :src="post.imgUrl" alt="Post Image" class="img-fluid" />
          </div>
          <!-- 오른쪽: 댓글 섹션 -->
          <div class="comments-section ml-3 d-flex flex-column justify-content-between">
            <div class="comments-list">
              <h6>댓글</h6>
              <ul>
                <li v-for="comment in comments" :key="comment.id">
                  {{ comment.content }}
                </li>
              </ul>
            </div>
            <form @submit.prevent="handleCommentSubmit" class="comment-form mt-auto">
              <MaterialInput v-model="newComment" class="form-control commentInput bg-gray-100" placeholder="댓글을 입력하세요"
                rows="3">
              </MaterialInput>
              <MaterialButton class="my-3 mb-2" variant="gradient" color="dark" fullWidth type="submit">
                댓글 작성
              </MaterialButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import { usePhotoSpotStore } from "@/stores/photoSpotStore";
import { useReviewStore } from "../stores/reviewStore";
import { postComment } from "../utils/utilsDb";
import { useUserStore } from "../stores/userStore";


const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const photoSpotStore = usePhotoSpotStore();
const reviewStore = useReviewStore();
const userStore = useUserStore();

const post = computed(() =>
  photoSpotStore.photoSpots.find((spot) => spot.id === props.postId)
);

const newComment = ref("");
const likeCount = ref(0);

const comments = computed(() => reviewStore.comments);

const closeModal = () => {
  emit("close");
};

const handleCommentSubmit = async () => {
  if (newComment.value.trim()) {
    // 댓글을 Firestore에 추가
    await postComment(props.postId, userStore.userEmail, newComment.value.trim()); // 사용자 이메일은 실제 사용자의 이메일로 교체
    newComment.value = "";
    // 댓글 목록을 다시 불러오기
    reviewStore.fetchComments(props.postId);
  } else {
    alert("댓글 내용을 입력해주세요!");
  }
};

// 포토스팟의 댓글을 가져옵니다.
onMounted(() => {
  reviewStore.fetchComments(props.postId);
});

const likePost = () => {
  likeCount.value++;
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.8);
  /* 배경을 더 어둡게 설정 */
  display: flex;
  /* 중앙 정렬을 위해 flexbox 사용 */
  align-items: center;
  /* 수직 중앙 정렬 */
  justify-content: center;
  /* 수평 중앙 정렬 */
  position: fixed;
  /* 화면 고정 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  /* 다른 요소들보다 앞에 오도록 설정 */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 1rem;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
}

.like-button {
  background: none;
  border: none;
  color: #f00;
  font-size: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: bold;
}

.heart-icon {
  margin-left: 5px;
}

.like-count {
  font-size: 26px;
  margin-right: 5px;
}

.modal-body {
  display: flex;
  justify-content: space-between;
}

.post-image {
  flex: 2;
  max-width: 100%;
  padding-right: 20px;
  position: relative;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.comments-section {
  flex: 1;
  max-width: 40%;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
}

.comments-list {
  overflow-y: auto;
  max-height: 350px;
  margin-bottom: 10px;
}

.comments-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.comments-section li {
  margin-bottom: 10px;
  padding: 8px;
  border-bottom: 1px solid #ccc;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.944);
}

.comment-form {
  margin-top: auto;
}

.commentInput {
  border-bottom: black 1px solid;
  padding-left: 10px;
  border-radius: 5px;
}
</style>