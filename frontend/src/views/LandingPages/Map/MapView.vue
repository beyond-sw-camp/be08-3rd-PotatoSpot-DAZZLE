<template>
  <div>
    <div class="container position-sticky z-index-sticky top-0">
      <div class="row">
        <div class="col-12">
          <NavbarDefault :sticky="true" />
        </div>
      </div>
    </div>
    <div class="map-area">
      <KakaoMap ref="kmap" class="kmap" :options="mapOption" />
      <div id="menu_wrap" class="search-bar mx-4 bg_white">
        <div class="option">
          <div>
            <form @submit.prevent="searchPlaces">
              키워드 : <input type="text" v-model="keyword" size="15" />
              <button type="submit">검색하기</button>
            </form>
          </div>
        </div>
        <hr />
        <ul id="placesList"></ul>
        <div id="pagination"></div>
      </div>
    </div>
  </div>
  <DetailsMarkerModal v-if="showModalMarker" :location="selectPlaceName" :address="selectPlaceAddr" :x="selectX"
    :y="selectY" @close="closeModalMarker" @postPhotoSpot="openModalPost" @showDetailSpot="openModalDetailSpot" />
  <PostModal v-if="showModalPost" :location="selectPlaceName" :address="selectPlaceAddr" :x="selectX" :y="selectY"
    @close="closeModalPost" />
  <DetailsSpotModal v-if="showModalDetailSpot" :post-id="selectSpotId" @close="closeModalDetailSpot" />
</template>

<script>
import { ref } from "vue";
import KakaoMap from "@/components/map/KakaoMap.vue";
import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";
import PostModal from "../../../components/PostModal.vue";
import DetailsMarkerModal from "../../../components/DetailsMarkerModal.vue";
import DetailsSpotModal from "../../../components/DetailsSpotModal.vue";
import { usePhotoSpotStore } from "@/stores/photoSpotStore";
import { useRouter } from "vue-router";



export default {
  components: {
    KakaoMap,
    NavbarDefault,
    PostModal,
    DetailsMarkerModal,
    DetailsSpotModal,
  },
  setup() {
    const showModalPost = ref(false);
    const showModalMarker = ref(false);
    const showModalDetailSpot = ref(false);
    const selectSpotId = ref('');
    const selectX = ref("");
    const selectY = ref("");
    const selectPlaceName = ref("");
    const selectPlaceAddr = ref("");
    const marker = ref(null); // 클릭한 위치에 표시할 마커
    const keyword = ref(""); // 검색 키워드
    const router = useRouter();

    const openModalPost = () => showModalPost.value = true;
    const closeModalPost = () => showModalPost.value = false;
    const openModalMarker = () => showModalMarker.value = true;
    const closeModalMarker = () => showModalMarker.value = false;
    const openModalDetailSpot = (spotId) => {
      console.log(spotId);
      selectSpotId.value = spotId;
      showModalDetailSpot.value = true;
    };
    const closeModalDetailSpot = () => showModalDetailSpot.value = false;


    return {
      showModalPost,
      showModalMarker,
      showModalDetailSpot,
      selectSpotId,
      selectX,
      selectY,
      selectPlaceName,
      selectPlaceAddr,
      openModalPost,
      closeModalPost,
      openModalMarker,
      closeModalMarker,
      openModalDetailSpot,
      closeModalDetailSpot,
      marker,
      keyword,
      router,
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
      markers: [], // 마커 배열
      clusterer: null,
      infowindow: null,
      geocoder: null, // 주소-좌표 변환 객체
    };
  },
  mounted() {
    const vueKakaoMap = this.$refs.kmap;
    const photoSpotStore = usePhotoSpotStore();

    this.$nextTick(async () => {
      const { kakao } = window;

      this.infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
      this.geocoder = new kakao.maps.services.Geocoder();

      this.clusterer = new kakao.maps.MarkerClusterer({
        map: vueKakaoMap.mapInstance,
        averageCenter: true,
        minLevel: 10,
        disableClickZoom: true,
        styles: [
          {
            width: "30px",
            height: "30px",
            background: "rgba(255, 100, 100, .8)",
            borderRadius: "15px",
            color: "#fff",
            textAlign: "center",
            lineHeight: "31px",
          },
        ],
      });

      this.map = vueKakaoMap.mapInstance;

      // 포토 스팟 데이터를 가져옵니다.
      await photoSpotStore.fetchPhotoSpots();
      const photoSpots = photoSpotStore.photoSpots;

      // 포토 스팟 데이터를 기반으로 마커를 추가합니다.
      photoSpots.forEach((spot, index) => {
        const position = new kakao.maps.LatLng(spot.y, spot.x);
        const marker = this.addMarker(position, index);

        // 마커에 이벤트 리스너 추가
        kakao.maps.event.addListener(marker, "mouseover", () => {
          this.displayInfowindow(marker, spot.place);
        });

        kakao.maps.event.addListener(marker, "mouseout", () => {
          this.infowindow.close();
        });

        kakao.maps.event.addListener(marker, "click", () => {
          this.selectX = spot.x; // X 좌표
          this.selectY = spot.y; // Y 좌표
          this.selectPlaceName = spot.place; // 장소 명
          this.selectPlaceAddr = spot.addr; // 주소
          this.openModalMarker(); // 모달 열기
        });

        this.markers.push(marker);
      });

      // 줌 컨트롤 추가
      const zoomControl = new kakao.maps.ZoomControl();
      this.map.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMRIGHT);

      // 지도 타입 컨트롤 추가
      const mapTypeControl = new kakao.maps.MapTypeControl();
      this.map.addControl(
        mapTypeControl,
        kakao.maps.ControlPosition.BOTTOMRIGHT
      );

      // 지도 클릭 이벤트 추가
      kakao.maps.event.addListener(this.map, "click", (mouseEvent) => {
        const latlng = mouseEvent.latLng;

        // 이전에 생성된 마커를 제거합니다.
        if (this.marker) {
          this.marker.setMap(null);
        }

        // 새 마커를 클릭한 위치에 생성합니다
        this.marker = new kakao.maps.Marker({
          position: latlng,
          map: this.map,
        });

        // 클릭한 위치의 좌표를 주소로 변환합니다
        this.searchDetailAddrFromCoords(latlng, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const detailAddr = result[0].address.address_name;

            const content = `${detailAddr}`; // 주소

            this.infowindow.setContent(content);
            this.infowindow.open(this.map, this.marker);

            kakao.maps.event.addListener(this.marker, "click", () => {
              this.selectX = latlng.La; // X 좌표
              this.selectY = latlng.Ma; // Y 좌표
              this.selectPlaceName = "장소 없음"; // 장소 명
              this.selectPlaceAddr = detailAddr; // 주소
              this.openModalMarker(); // 모달 열기
            });
          }
        });
      });

      document.getElementById("keyword").addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
          this.searchPlaces();
        }
      });

      this.searchPlaces();
    });
  },
  methods: {
    zoom(delta) {
      const level = Math.max(1, this.mapOption.level + delta);
      this.mapOption.level = level;
      this.map.setLevel(level);
    },
    searchPlaces() {
      const { kakao } = window;
      const keyword = this.keyword;

      if (!keyword.trim()) {
        this.router.go(0);
        return;
      }

      const ps = new kakao.maps.services.Places();
      ps.keywordSearch(keyword, this.placesSearchCB.bind(this));
    },
    placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        this.displayPlaces(data);
        this.displayPagination(pagination);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert("검색 결과 중 오류가 발생했습니다.");
      }
    },
    displayPlaces(places) {
      const listEl = document.getElementById("placesList");
      const menuEl = document.getElementById("menu_wrap");
      const fragment = document.createDocumentFragment();
      const bounds = new kakao.maps.LatLngBounds();

      this.removeAllChildNods(listEl);
      this.removeMarker();

      places.forEach((place, index) => {
        const placePosition = new kakao.maps.LatLng(place.y, place.x);
        const marker = this.addMarker(placePosition, index);
        const itemEl = this.getListItem(index, place, placePosition);

        bounds.extend(placePosition);

        kakao.maps.event.addListener(marker, "mouseover", () => {
          this.displayInfowindow(marker, place.place_name);
        });

        kakao.maps.event.addListener(marker, "mouseout", () => {
          this.infowindow.close();
        });

        kakao.maps.event.addListener(marker, "click", () => {
          this.centerMap(placePosition);
        });

        kakao.maps.event.addListener(marker, "click", () => {
          console.log(place.x, place.y, place.place_name, place.address_name);
          console.log(place);
          this.selectX = place.x; // X 좌표
          this.selectY = place.y; // Y 좌표
          this.selectPlaceName = place.place_name; // 장소 명
          this.selectPlaceAddr = place.address_name; // 주소
          this.openModalMarker(); // 모달 열기
        });

        fragment.appendChild(itemEl);
      });

      listEl.appendChild(fragment);
      menuEl.scrollTop = 0;

      this.map.setBounds(bounds);

      this.clusterer.addMarkers(this.markers);
    },
    getListItem(index, place, position) {
      const el = document.createElement("li");
      let itemStr = `<span class="markerbg marker_${index + 1}"></span>
                     <div class="info">
                       <h5>${place.place_name}</h5>`;

      if (place.road_address_name) {
        itemStr += `<span>${place.road_address_name}</span>
                    <span class="jibun gray">${place.address_name}</span>`;
      } else {
        itemStr += `<span>${place.address_name}</span>`;
      }

      itemStr += `<span class="tel">${place.phone}</span>
                  </div>`;

      el.innerHTML = itemStr;
      el.className = "item";

      el.addEventListener("click", () => {
        this.centerMap(position);
        this.map.setLevel(4);
      });

      return el;
    },
    addMarker(position, idx) {
      const { kakao } = window;
      const imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
      const imageSize = new kakao.maps.Size(36, 37);
      const imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691),
        spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
        offset: new kakao.maps.Point(13, 37),
      };
      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imgOptions
      );
      const marker = new kakao.maps.Marker({
        position,
        image: markerImage,
      });

      marker.setMap(this.map);
      this.markers.push(marker);

      return marker;
    },
    removeMarker() {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
    },
    displayPagination(pagination) {
      const paginationEl = document.getElementById("pagination");
      const fragment = document.createDocumentFragment();

      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
      }

      for (let i = 1; i <= pagination.last; i++) {
        const el = document.createElement("a");
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
          el.className = "on";
        } else {
          el.onclick = () => {
            pagination.gotoPage(i);
          };
        }

        fragment.appendChild(el);
      }
      paginationEl.appendChild(fragment);
    },
    displayInfowindow(marker, title) {
      const content = `<div style="padding:5px;z-index:1;">${title}</div>`;

      this.infowindow.setContent(content);
      this.infowindow.open(this.map, marker);
    },
    removeAllChildNods(el) {
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
      }
    },
    centerMap(position) {
      this.map.setCenter(position);
    },
    searchDetailAddrFromCoords(coords, callback) {
      // 좌표로 법정동 상세 주소 정보를 요청합니다
      this.geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
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
  margin: 0;
  padding: 0;
  height: 90vh;
  font-family: "Malgun Gothic", dotum, "돋움", sans-serif;
  font-size: 12px;

  a,
  a:hover,
  a:active {
    color: #000;
    text-decoration: none;
  }

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

  #menu_wrap {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 350px;
    margin: 10px 0 30px 10px;
    margin-top: 115px;
    padding: 5px;
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.7);
    z-index: 1;
    font-size: 12px;
    border-radius: 10px;
    border: 2px solid lightgray;
  }


  .bg_white {
    background: #fff;
  }

  #menu_wrap hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 2px solid #5f5f5f;
    margin: 3px 0;
  }

  #menu_wrap .option {
    text-align: center;
  }

  #menu_wrap .option p {
    margin: 10px 0;
  }

  #menu_wrap .option button {
    margin-left: 5px;
  }

  #placesList li {
    list-style: none;
  }

  #placesList .item {
    position: relative;
    border-bottom: 1px solid #888;
    overflow: hidden;
    cursor: pointer;
    min-height: 65px;
  }

  #placesList .item span {
    display: block;
    margin-top: 4px;
  }

  #placesList .item h5,
  #placesList .item .info {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  #placesList .item .info {
    padding: 10px 0 10px 55px;
  }

  #placesList .info .gray {
    color: #8a8a8a;
  }

  #placesList .info .jibun {
    padding-left: 26px;
    background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_jibun.png) no-repeat;
  }

  #placesList .info .tel {
    color: #009900;
  }

  #placesList .item .markerbg {
    float: left;
    position: absolute;
    width: 36px;
    height: 37px;
    margin: 10px 0 0 10px;
    background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png) no-repeat;
  }

  #placesList .item .marker_1 {
    background-position: 0 -10px;
  }

  #placesList .item .marker_2 {
    background-position: 0 -56px;
  }

  #placesList .item .marker_3 {
    background-position: 0 -102px;
  }

  #placesList .item .marker_4 {
    background-position: 0 -148px;
  }

  #placesList .item .marker_5 {
    background-position: 0 -194px;
  }

  #placesList .item .marker_6 {
    background-position: 0 -240px;
  }

  #placesList .item .marker_7 {
    background-position: 0 -286px;
  }

  #placesList .item .marker_8 {
    background-position: 0 -332px;
  }

  #placesList .item .marker_9 {
    background-position: 0 -378px;
  }

  #placesList .item .marker_10 {
    background-position: 0 -423px;
  }

  #placesList .item .marker_11 {
    background-position: 0 -470px;
  }

  #placesList .item .marker_12 {
    background-position: 0 -516px;
  }

  #placesList .item .marker_13 {
    background-position: 0 -562px;
  }

  #placesList .item .marker_14 {
    background-position: 0 -608px;
  }

  #placesList .item .marker_15 {
    background-position: 0 -654px;
  }

  #pagination {
    margin: 10px auto;
    text-align: center;
  }

  #pagination a {
    display: inline-block;
    margin-right: 10px;
  }

  #pagination .on {
    font-weight: bold;
    cursor: default;
    color: #777;
  }
}
</style>
