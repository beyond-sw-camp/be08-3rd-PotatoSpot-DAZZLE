<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['card-clicked']);
const handleClick = (spotId) => {
  emit('card-clicked', spotId);
};

// props 설정
const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  action: {
    type: Array,
    required: true,
    // 스펙을 배열로 정의
    default: () => []
  }
});
</script>

<template>
  <div class="back" :style="{
    backgroundImage: `url(${props.image})`,
    backgroundSize: 'cover',
    borderRadius: '15px',
    overflow: 'hidden',
    height: '100%',
    width: '100%',
    opacity: 0.9,
    backgroundColor: backgroundColor
  }">
    <div class="card-body pt-4 text-center bg-danger opacity-8">
      <h3 class="text-white" v-html="props.title"></h3>
      <p class="text-white">
        {{ props.description }}
      </p>
      <div class="buttons-group">
        <a v-for="({ spotId, color, label }, index) in props.action" :key="index" target="_blank"
          class="btn btn-sm mt-3 inline-block ms-1" :class="`${color ? `btn-${color}` : 'btn-white'}`"
          @click="handleClick(spotId)">{{ label }}</a>
      </div>
    </div>
  </div>
</template>
