<template>
    <div ref="map">
        <slot name="overlay"></slot>
    </div>
</template>
<script>
let kakao = window.kakao;
export default {
    props: ['options'],
    data() {
        return {
            mapInstance: null
        }
    },
    mounted() {
        kakao = kakao || window.kakao;
        // console.log(this.$refs.map);

        var container = this.$refs.map

        const {center, level} = this.options;
        this.mapInstance = new kakao.maps.Map(container, {
            center: new kakao.maps.LatLng(center.lat, center.lng),
            level,
        });
    },
    watch: {
        "options.level"(cur/* , prev */) {
            // console.log(`[LEVEL CHANGED] ${prev} => ${cur}`); // for test
            this.mapInstance.setLevel(cur);
            
        },
        "options.center"(cur) {
            // console.log("[NEW CENTER]", cur.lat, cur.lng); // for test
            // this.mapInstance.setCenter(new kakao.maps.LatLng(cur.lat, cur.lng));
            this.mapInstance.panTo(new kakao.maps.LatLng(cur.lat, cur.lng));
            // 부드럽게 이동
        },
    },
};
</script>
<style>
.kmap {
    /* height: 100vh; */
    height: 600px;
}
</style>