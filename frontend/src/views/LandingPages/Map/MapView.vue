<template>
  <div>
    <!-- <div class="controll">
      <button @click="zoom(-1)">
        <span class="material-icons"> zoom_in </span>
      </button>
      <button @click="zoom(1)">
        <span class="material-icons"> zoom_out </span>
      </button>
    </div> -->
    <div class="map-area">
      <SlideMenu
        :map-option="mapOption"
        @update-map-center="updateMapCenter"
        v-if="menuVisible"
      />
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
      <!-- 사용자 정의 지도 타입 및 확대/축소 컨트롤 -->
      <div class="custom_typecontrol radius_border">
        <span
          id="btnRoadmap"
          :class="{ 'selected_btn': mapType === 'roadmap', 'btn': mapType !== 'roadmap' }"
          @click="setMapType('roadmap')"
        >
          지도
        </span>
        <span
          id="btnSkyview"
          :class="{ 'selected_btn': mapType === 'skyview', 'btn': mapType !== 'skyview' }"
          @click="setMapType('skyview')"
        >
          스카이뷰
        </span>
      </div>
      <div class="custom_zoomcontrol radius_border">
        <span @click="zoomIn">
          <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png" alt="확대" />
        </span>
        <span @click="zoomOut">
          <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png" alt="축소" />
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { useUiStore } from "@/stores/ui";
import KakaoMap from "@/components/map/KakaoMap.vue";
import api from "@/service/api";
import MarkerHandler from "@/components/map/marker-handler.js";
import KakoOverlay from "@/components/map/overlay";
import SlideMenu from "@/components/slideMenu/SlideMenu.vue";

export default {
  components: {
    KakaoMap,
    SlideMenu,
  },
  setup() {
    const uiStore = useUiStore();

    return {
      menuVisible: uiStore.leftMenu.visible,
      toggleMenu: uiStore.toggleMenu,
      setMenuVisible: uiStore.setMenuVisible,
    };
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
      mapType: 'roadmap',
      harbors: [],
      markers: null,
      activeHarbor: null,
      overlay: null,
      overlayHarbor: null,
      clusterer: null,
    };
  },
  mounted() {
    const vueKakaoMap = this.$refs.kmap;

    this.$nextTick(() => {
      const { kakao } = window;

      this.clusterer = new kakao.maps.MarkerClusterer({
        map: vueKakaoMap.mapInstance,
        averageCenter: true,
        minLevel: 10,
      });

      this.markers = new MarkerHandler(vueKakaoMap, {
        markerClicked: (harbor) => {
          this.showOnMap(harbor);
          this.overlayHarbor = harbor;
          this.overlay.showAt(harbor.lat, harbor.lng);
        },
      });
      this.overlay = new KakoOverlay(vueKakaoMap, this.$refs.harborOverlay);

      api.harbor.all((res) => {
        this.harbors = res.harbors;
        const markerObjects = this.harbors.map((harbor) => {
          return new kakao.maps.Marker({
            position: new kakao.maps.LatLng(harbor.lat, harbor.lng),
          });
        });

        this.clusterer.addMarkers(markerObjects);
      });
    });
  },
  methods: {
    // zoom(delta) {
    //   const level = Math.max(1, this.mapOption.level + delta);
    //   this.mapOption.level = level;
    // },
    zoomIn() {
      this.mapOption.level = Math.max(1, this.mapOption.level - 1);
    },
    zoomOut() {
      this.mapOption.level = Math.min(14, this.mapOption.level + 1);
    },
    showOnMap(harbor) {
      this.activeHarbor = harbor;
      this.mapOption.center = {
        lat: harbor.lat,
        lng: harbor.lng,
      };
    },
    closeOverlay() {
      this.overlay.hide();
    },
    updateMapCenter(center) {
      this.mapOption.center = center;
    },
    setMapType(type) {
      const { kakao } = window;
      const map = this.$refs.kmap.mapInstance;
      const roadmapControl = document.getElementById('btnRoadmap');
      const skyviewControl = document.getElementById('btnSkyview'); 
      if (type === 'roadmap') {
        map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
        roadmapControl.className = 'selected_btn';
        skyviewControl.className = 'btn';
      } else if (type === 'skyview') {
        map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
        skyviewControl.className = 'selected_btn';
        roadmapControl.className = 'btn';
      }
      this.mapType = type;
    },
  },
};
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
  overflow: hidden;
  width: 100%;
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
  .radius_border{border:1px solid #919191;border-radius:5px;}     
  .custom_typecontrol {position:absolute;top:10px;right:10px;overflow:hidden;width:130px;height:30px;margin:0;padding:0;z-index:1;font-size:12px;font-family:'Malgun Gothic', '맑은 고딕', sans-serif;}
  .custom_typecontrol span {display:block;width:65px;height:30px;float:left;text-align:center;line-height:30px;cursor:pointer;}
  .custom_typecontrol .btn {background:#fff;background:linear-gradient(#fff,  #e6e6e6);}       
  .custom_typecontrol .btn:hover {background:#f5f5f5;background:linear-gradient(#f5f5f5,#e3e3e3);}
  .custom_typecontrol .btn:active {background:#e6e6e6;background:linear-gradient(#e6e6e6, #fff);}    
  .custom_typecontrol .selected_btn {color:#fff;background:#425470;background:linear-gradient(#425470, #5b6d8a);}
  .custom_typecontrol .selected_btn:hover {color:#fff;}   
  .custom_zoomcontrol {position:absolute;top:50px;right:10px;width:36px;height:80px;overflow:hidden;z-index:1;background-color:#f5f5f5;} 
  .custom_zoomcontrol span {display:block;width:36px;height:40px;text-align:center;cursor:pointer;}     
  .custom_zoomcontrol span img {width:15px;height:15px;padding:12px 0;border:none;}             
  .custom_zoomcontrol span:first-child{border-bottom:1px solid #bfbfbf;} 
}
</style>
