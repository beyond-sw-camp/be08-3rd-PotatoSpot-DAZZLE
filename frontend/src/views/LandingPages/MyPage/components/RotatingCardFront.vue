<script setup>
defineProps({
  image: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div :style="{
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    height: '100%',
    width: '100%',
    borderRadius: '15px',
    overflow: 'hidden',
  }">
    <div class="card-body py-7 text-center"
      style="height: 300px; width: 100%; display: flex; flex-direction: column; justify-content: center;">
      <i v-if="icon" class="material-icons text-white text-4xl my-3">{{ icon }}</i>
      <p v-if="label" class="text-sm text-white text-uppercase font-weight-normal">
        {{ label }}
      </p>
      <h3 class="text-white" v-html="title" />
      <p class="text-white opacity-8">
        {{ description }}
      </p>
    </div>
  </div>
</template>
