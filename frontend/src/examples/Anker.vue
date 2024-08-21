<script setup>
// Vue Material Kit 2 components
import MaterialButton from "@/components/MaterialButton.vue";
import { ref, onMounted, onUnmounted } from "vue";

// 스크롤 위치와 가속도 변수
const scrollY = ref(window.scrollY);
const translateY = ref(0);
let scrollTimeout = null;

// 스크롤 오프셋 (원하는 만큼 조정 가능)
const offset = 100;

// 가속도 계수와 최대 이동 범위 설정
const accelerationFactor = 0.3; // 가속도 계수 약간 감소
const maxTranslateY = 1500; // 최대 이동 범위

let targetTranslateY = ref(0);

const handleScroll = () => {
    clearTimeout(scrollTimeout);

    const newScrollY = window.scrollY;
    const delta = newScrollY - scrollY.value;

    targetTranslateY.value += delta * accelerationFactor;

    // 이동 범위를 제한
    if (targetTranslateY.value > maxTranslateY) {
        targetTranslateY.value = maxTranslateY;
    } else if (targetTranslateY.value < -maxTranslateY) {
        targetTranslateY.value = -maxTranslateY;
    }

    scrollY.value = newScrollY;

    // 부드러운 애니메이션을 위해 requestAnimationFrame 사용
    window.requestAnimationFrame(() => {
        translateY.value += (targetTranslateY.value - translateY.value) * 0.05; // 부드러운 이동을 위해 0.05 곱함
    });

    scrollTimeout = setTimeout(() => {
        targetTranslateY.value = 0;
    }, 300);
};

// 스크롤 이벤트 리스너 등록
onMounted(() => {
    scrollY.value = window.scrollY; // 초기 스크롤 위치 설정
    window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const sectionPosition = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
            top: sectionPosition - offset,
            behavior: 'smooth'
        });
    }
}
</script>

<template>
    <div class="anker-container" :style="{ transform: `translateY(${translateY.value}px)` }">
        <MaterialButton 
            color="light" 
            class="vertical-button" 
            @click="scrollToSection('presentationCounter')"
        >
            Presentation<br />Counter
        </MaterialButton>
        <MaterialButton 
            color="light" 
            class="vertical-button" 
            @click="scrollToSection('thumbnails')"
        >
            Thumbnails
        </MaterialButton>
        <MaterialButton 
            color="light"
            class="vertical-button" 
            @click="scrollToSection('rankingList')"
        >
            Ranking<br />List
        </MaterialButton>
    </div>
</template>

<style scoped>
.anker-container {
    position: fixed;
    top: 20%; /* 상단에서 20% 위치 */
    left: 1%;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: transform 0.3s ease-out; /* 부드럽게 원래 위치로 돌아오도록 설정 */
}

/* 버튼 스타일 조정 */
.vertical-button {
    writing-mode: vertical-lr; /* 텍스트를 위에서 아래로 읽히게 함 */
    text-orientation: upright; /* 텍스트 방향을 똑바로 설정 */
    padding: 8px;
    font-size: 12px; /* 텍스트 크기 조정 */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 1.2; /* 텍스트 줄 간격 설정 */
    width: auto; /* 버튼 너비 자동 조정 */
    height: auto; /* 버튼 높이 자동 조정 */
    cursor: pointer; /* 커서를 포인터로 변경 */
}
</style>
