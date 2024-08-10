<template>
    <div>
        <h3>Kakao Map Demo(center, level)</h3>
        <div class="controll">
            <button @click="zoom(-1)">
                <span class="material-icons"> zoom_in </span>
            </button>
            <button @click="zoom(1)">
                <span class="material-icons"> zoom_out </span>
            </button>
        </div>
        <KakaoMap class="kmap" :options="mapOption"/>
    </div>
</template>
<script>
import KakaoMap from './components/map/KakaoMap.vue';
export default {
    components: {
        KakaoMap,
    },
    data() {
        return {
            mapOption: {
                center: {
                    lat: 37.497212875468755,
                    lng: 126.92761685591375,
                },
                level: 3,
            },
        };
    },
    mounted() {
        
    },
    methods: {
        zoom(delta) {
            // console.log("[delta]", delta);
            const level = Math.max(1, this.mapOption.level + delta);
            this.mapOption.level = level;
            // console.log(this.mapOption.level);
        }
    },
}
</script>
<style>
button {
    border: 1px solid transparent;
    padding: 6px;
    background-color: #efefefdd;
    border-radius: 6px;
    &:hover {
        background-color: #ddd;
        border-color: #ddd;
        cursor: pointer;
    }
    &:active {
        background-color: #aaa;
        border-color: #aaa;
    }
}
</style>