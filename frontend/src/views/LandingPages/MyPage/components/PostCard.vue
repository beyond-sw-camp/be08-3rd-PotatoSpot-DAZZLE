<script setup>
import { onMounted } from "vue";

// tooltip
import setTooltip from "@/assets/js/tooltip";

// store
import { useAppStore } from "@/stores";
import { RouterLink } from "vue-router";
const store = useAppStore();

defineProps({
  route: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
});

onMounted(() => {
  setTooltip(store.bootstrap);
});
</script>

<template>
  <a href="/" class="card-link">
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
  </a>
</template>

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
