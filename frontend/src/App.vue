<template>
  <div>
    <h3>Kakao Map Demo(center, level)</h3>
    <div class="kmap" ref="map"></div>
  </div>
</template>
<script>
export default {
  mounted() {
    let kakao = window.kakao;
    console.log(this.$refs.map);
    
    var container = this.$refs.map
    var options = {
      center: new kakao.maps.LatLng(37.497212875468755, 126.92761685591375),
      level: 3,
    };

    const mapInstance = new kakao.maps.Map(container, options);
    console.log(mapInstance);
    
  },
}
</script>
<style>
.kmap {
  width: 100%;
  height: 600px;
}
</style>