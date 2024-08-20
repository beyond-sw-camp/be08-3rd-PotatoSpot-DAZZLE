<template>
  <div class="modal fade show" tabindex="-1" style="display: block" aria-modal="true" role="dialog" @click="closeModal">
    <div class="modal-dialog modal-dialog-centered modal-xl" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ post.title }}</h5>
          <button @click="incrementLike(postId)" class="like-button">
            <span class="like-count">{{ post.likes }}</span>
            <span class="heart-icon">&#10084;</span>
          </button>
        </div>
        <div class="modal-body d-flex">
          <!-- 왼쪽: 게시글 이미지 및 내용 -->
          <div class="post-details d-flex flex-column" style="flex: 2; padding-right: 20px;">
            <div class="post-image mb-3">
              <img :src="post.imgUrl" alt="Post Image" class="img-fluid" />
            </div>
            <div class="post-content">
              <p class="content-text">{{ post.content }}</p>
            </div>
          </div>
          <!-- 오른쪽: 댓글 섹션 -->
          <div class="comments-section" style="flex: 1;">
            <div class="comments-header">
              <h6>댓글</h6>
            </div>
            <ul class="comments-list">
              <li v-for="comment in comments" :key="comment.id">
                {{ comment.content }}
              </li>
            </ul>
            <form @submit.prevent="handleCommentSubmit" class="comment-form mt-3">
              <MaterialInput v-model="newComment" class="form-control commentInput bg-gray-100" placeholder="댓글을 입력하세요" rows="3">
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
import { postComment, incrementLikes } from "../utils/utilsDb";
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

const likes = computed(() => photoSpotStore.likes);
const comments = computed(() => reviewStore.comments);

const closeModal = () => {
  emit("close");
};

const handleCommentSubmit = async () => {
  if (newComment.value.trim()) {
    await postComment(props.postId, userStore.userEmail, newComment.value.trim());
    newComment.value = "";
    reviewStore.fetchComments(props.postId);
  } else {
    alert("댓글 내용을 입력해주세요!");
  }
};

onMounted(() => {
  reviewStore.fetchComments(props.postId);
});

const incrementLike = async (spotId) => {
  try {
    await incrementLikes(spotId);
    photoSpotStore.fetchPhotoSpots();
  } catch (error) {
    console.error("Error incrementing like:", error);
  }
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
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
  font-size: 1.5rem;
  font-weight: 600;
}

.like-button {
  background: none;
  border: none;
  color: #f00;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.heart-icon {
  margin-left: 5px;
}

.like-count {
  font-size: 20px;
  margin-right: 5px;
}

.modal-body {
  padding: 1rem;
  display: flex;
}

.post-image img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 5px;
}


.content-text {
  font-size: 1.3rem;
  font-weight: bold;
  line-height: 1.6;
}

.comments-section {
  border-left: 1px solid #ccc;
  padding-left: 20px;
  max-height: 500px; /* 댓글 섹션의 최대 높이 설정 */
  overflow-y: auto; /* 댓글 섹션에 스크롤바 추가 */
  flex: 1;
  display: flex;
  flex-direction: column;
}

.comments-header {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  padding-bottom: 10px;
}

.comments-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
}

.comments-list li {
  margin-bottom: 10px;
  padding: 8px;
  border-bottom: 1px solid #ccc;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.944);
}

.comment-form {
  margin-top: 20px;
  position: sticky;
  bottom: 0;
  background: white;
  padding-top: 10px;
}

.commentInput {
  border-bottom: 1px solid black;
  padding-left: 10px;
  border-radius: 5px;
}
</style>
