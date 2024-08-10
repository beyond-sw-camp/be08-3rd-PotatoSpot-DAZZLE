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
        <div class="map-area">
            <div class="harbors">
                <div class="harbor" v-for="hbr in harbors" :key="hbr.seq" @click="showOnMap(hbr)">
                    <h4>{{ hbr.place }}</h4>
                </div>
            </div>
            <KakaoMap class="kmap" :options="mapOption"/>
        </div>
    </div>
</template>
<script>
import KakaoMap from './components/map/KakaoMap.vue';
import api from './service/api';
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
            harbors: [],
        };
    },
    mounted() {
        api.harbor.all(res => {
            console.log('[포토 스팟]', res.harbors);
            this.harbors = res.harbors;
        });
    },
    methods: {
        zoom(delta) {
            const level = Math.max(1, this.mapOption.level + delta);
            this.mapOption.level = level;
        },
        showOnMap(harbor) {
            this.mapOption.center = {
                lat: harbor.lat,
                lng: harbor.lng,
            };
        },
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

.map-area {
    display: flex;
    .harbors {
        .harbor {
            padding: 10px;
            border: 1px solid transparent;
            &:hover {
                background-color: aliceblue;
                border-color: #6a9dff;
                cursor: pointer;
            }
            &:active {
                background-color: rgb(166, 197, 224);
                border-color: #4471c5;
            }
            h4 {
                margin: 0;
            }
        }
    }
    .kmap {
        flex: 1 1 auto;
    }
}
</style>