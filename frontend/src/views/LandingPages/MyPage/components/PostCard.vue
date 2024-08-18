<template>
  <div @click="handleClick" class="card-link" style="cursor: pointer;">
    <div class="card" :style="{
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      height: '200px',
      width: '100%',
      borderRadius: '15px',
      overflow: 'hidden',
      position: 'relative',
      transition: 'transform 0.5s ease'
    }">
      <div class="card-title d-flex flex-column justify-content-end" style="height: 100%; width: 100%; padding: 8px;">
        <h6 class="text-white mb-9 text-center">{{ title }}</h6>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const props = defineProps({
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  postId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['card-clicked']); // 클릭 이벤트 정의

const handleClick = () => {
  emit('card-clicked', props.postId); // 클릭 시 postId를 부모 컴포넌트로 전달
};
</script>

<style scoped>
.card {
  position: relative;
  display: flex;
  align-items: flex-end;
  text-align: left;
}

.card-title h6 {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 4px;
  color: white;
}

.card-link {
  text-decoration: none;
}

.card:hover {
  transform: translateY(-5px);
}
</style>
