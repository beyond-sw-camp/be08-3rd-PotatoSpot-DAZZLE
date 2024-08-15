<template>
    <div class="searchbox">
        <div>
            <input type="text" value="부산" @keyup.enter="searchPlace">
        </div>
        <div class="results">
            <div class="place" v-for="rs in search.results" :key="rs.id" @click="showPlace(rs)">
                <h4>{{ rs.place_name }}</h4>
                <div class="addr">{{ rs.address_name }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        mapOption: Object
    },
    data() {
        return {
            search: {
                keyword: null,
                pgn: null,
                results: [],
            },
        };
    },
    methods: {
        searchPlace(e) {
            const keyword = e.target.value.trim();
            if (keyword.length === 0) {
                return;
            }

            const ps = new window.kakao.maps.services.Places();
            ps.keywordSearch(keyword, (data, status, pgn) => {
                this.search.keyword = keyword;
                this.search.pgn = pgn;
                this.search.results = data;
            });
        },
        showPlace(place) {
            console.log(place);

            // 이벤트 발생
            this.$emit('update-map-center', {
                lat: place.y,
                lng: place.x
            });
        },
    },
}
</script>

<style lang="scss" scoped>
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
</style>