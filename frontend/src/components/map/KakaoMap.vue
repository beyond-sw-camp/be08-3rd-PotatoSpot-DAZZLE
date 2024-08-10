<template>
    <div ref="map"></div>
</template>
<script>
export default {
    props: ['options'],
    data() {
        return {
            mapInstance: null
        }
    },
    mounted() {
        let kakao = window.kakao;
        console.log(this.$refs.map);

        var container = this.$refs.map
        // var options = {
        //     center: new kakao.maps.LatLng(37.497212875468755, 126.92761685591375),
        //     level: 3,
        // };

        const {center, level} = this.options;
        this.mapInstance = new kakao.maps.Map(container, {
            center: new kakao.maps.LatLng(center.lat, center.lng),
            level,
        });
        // console.log(this.mapInstance);
    },
    watch: {
        "options.level"(cur, prev) {
            console.log(`[LEVEL CHANGED] ${prev} => ${cur}`);
            this.mapInstance.setLevel(cur);
            
        },
    },
};
</script>
<style>
.kmap {
    width: 100%;
    height: 600px;
}
</style>