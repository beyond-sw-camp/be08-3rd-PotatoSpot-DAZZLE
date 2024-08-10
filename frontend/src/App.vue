<template>
    <div>
        <h3>Kakao Map Demo(center, level)</h3>
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
        // let kakao = window.kakao;
        // console.log(this.$refs.map);

        // var container = this.$refs.map
        // var options = {
        //     center: new kakao.maps.LatLng(37.497212875468755, 126.92761685591375),
        //     level: 3,
        // };

        // const mapInstance = new kakao.maps.Map(container, options);
        // console.log(mapInstance);

    },
}
</script>
<style>

</style>