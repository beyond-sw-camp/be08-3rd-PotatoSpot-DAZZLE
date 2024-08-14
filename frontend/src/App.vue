<template>
    <div>
        <h3>Kakao Map(center, level)</h3>
        <div class="controll">
            <button @click="zoom(-1)">
                <span class="material-icons"> zoom_in </span>
            </button>
            <button @click="zoom(1)">
                <span class="material-icons"> zoom_out </span>
            </button>
        </div>
        <div class="map-area">
            <div class="searchbox">
                <div>
                    <input type="text" value="포토 스팟" @keyup.enter="searchPlace">
                </div>
                <div class="results">
                    <div class="place" v-for="rs in search.results" :key="rs.id" @click="showPlace(rs)">
                        <h4>{{ rs.place_name }}</h4>
                        <div class="addr">{{ rs.address_name }}</div>
                    </div>
                </div>
            </div>
            <KakaoMap ref="kmap" class="kmap" :options="mapOption">
                <template v-slot:overlay>
                    <div class="overlay-popup" ref="harborOverlay">
                        <div v-if="overlayHarbor">
                            <h3>{{ overlayHarbor.place }}</h3>
                            <div class="addr">{{ overlayHarbor.addr }}</div>
                            <a class="close" href="#" @click.prevent="closeOverlay()">
                                <span class="material-icons"> close </span>
                            </a>
                        </div>
                    </div>
                </template>
            </KakaoMap>
        </div>
    </div>
</template>
<script>
import KakaoMap from './components/map/KakaoMap.vue';
import api from './service/api';
import MarkerHandler from './components/map/marker-handler.js';
import KakoOverlay from './components/map/overlay';

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
                level: 4,
            },
            search: {
                keyword: null,
                pgn: null,
                results: [],
            },
            harbors: [],
            markers: null, // marker handler
            activeHarbor: null, // selected harbor!

            overlay: null, // overlay 인스턴스
            overlayHarbor: null, // overlay에 보여줄 포토 스팟
        };
    },
    mounted() {
        const vueKakaoMap = this.$refs.kmap;

        this.markers = new MarkerHandler(vueKakaoMap, {
            markerClicked: (harbor) => {
                // console.log("[clicked ]", harbor);
                // this.activeHarbor = harbor;
                this.showOnMap(harbor);
                // 마커 클릭 시
                this.overlayHarbor = harbor;
                this.overlay.showAt(harbor.lat, harbor.lng);
            },
        });
        this.overlay = new KakoOverlay(vueKakaoMap, this.$refs.harborOverlay);

        api.harbor.all(res => {
            // console.log('[포토 스팟]', res.harbors);
            this.harbors = res.harbors;
            // create markers
            this.markers.add(this.harbors, (harbor) => {
                return {lat: harbor.lat, lng: harbor.lng};
            });
        });
    },
    methods: {
        searchPlace(e) {
            const keyword = e.target.value.trim();
            if(keyword.length === 0) {
                return;
            }

            const ps = new window.kakao.maps.services.Places();
            ps.keywordSearch(keyword, (data, status, pgn) => {
                this.search.keyword = keyword;
                this.search.pgn = pgn;
                this.search.results = data;
            });
        },
        zoom(delta) {
            const level = Math.max(1, this.mapOption.level + delta);
            this.mapOption.level = level;
        },
        showOnMap(harbor) {
            this.activeHarbor = harbor;
            this.mapOption.center = {
                lat: harbor.lat,
                lng: harbor.lng,
            };
        },
        showPlace(place) {
            console.log(place);
            
            this.mapOption.center = {
                lat: place.y,
                lng: place.x 
            };
        },
        closeOverlay() {
            this.overlay.hide();
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

.map-area {
    display: flex;
    position: relative;
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
            &.active {
                background-color: rgb(253, 229, 150);
                border-color: rgb(211, 173, 3);
            }
            h4 {
                margin: 0;
            }
        }
    }
    .searchbox {
        position: absolute;
        top: 0;
        left: 0;
        height: 600px;
        z-index: 10000;
        background-color: white;
        width: 300px;
        display: flex;
        flex-direction: column;
        .results {
            flex: 1 1 auto;
            overflow-y: auto;
            .place {
                padding: 8px;
                cursor: pointer;

                h4 {
                    margin: 0;
                }
            }
        }
    }
    .kmap {
        flex: 1 1 auto;
        .overlay-popup {
            background-color: #ffffffcc;
            box-shadow: 0 0 8px #0000004d, 0 0 1px 2px #00000022;
            max-width: 200px;
            min-width: 160px;
            position: absolute;
            bottom: 44px;
            left: 50%;
            transform: translateX(-50%);
            h3 {
                margin: 0;
                padding: 8px;
                padding-right: 24px;
                background-color: #ed4215;
                color: white;
                font-weight: 400;
                font-size: 16px;
            }
            .addr {
                padding: 8px;
                white-space: break-spaces;
            }
            .close {
                color: black;
                position: absolute;
                top: 0;
                left: 100%;
                transform: translate(-50%, -50%);
                background-color: white;
                border-radius: 100%;
                line-height: 0;
                padding: 6px;
                box-shadow: 0 0 6px #0000004d;
            }
        }
    }
}
</style>
