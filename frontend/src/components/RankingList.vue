<template>
    <div class="ranking-list">
        <h2>DAZZLE Ranking</h2>
        <ul>
            <li v-for="(item, index) in rankings" :key="item.seq" class="ranking-item">
                <!-- 순위 및 위치 정보 섹션 -->
                <div class="place-location">
                    <span class="place">{{ index + 1 }}. {{ item.place }}</span>
                    <span class="location">{{ item.addr }}</span>
                </div>

                <!-- 지금은 하트나 별을 눌러도 NaN이 나오는데 그 이유는 초기값을 설정 안해서 그런거! -->
                <!-- 좋아요 섹션 -->
                <div class="icons">
                    <div class="icon-with-count">
                        <span 
                            v-if="item.isLiked" 
                            @click="toggleLike(item.seq)" 
                            class="material-symbols-rounded">
                            favorite
                        </span>
                        <span 
                            v-else 
                            @click="toggleLike(item.seq)" 
                            class="material-symbols-outlined">
                            favorite_border
                        </span>
                        <span class="likes">{{ item.likes }}</span>
                    </div>
                
                <!-- 찜하기 섹션 -->
                    <div class="icon-with-count">
                        <span 
                            v-if="item.isStar"
                            @click="toggleStar(item.seq)"
                            class="material-symbols-rounded">
                            star
                        </span>
                        <span 
                            v-else
                            @click="toggleStar(item.seq)"
                            class="material-symbols-outlined">
                            star_border
                        </span>
                        <span class="star">{{ item.starCount }}</span>
                    </div>
                </div>
            </li>
            <!-- 더보기 누르면 리스트 더 나오도록 만들고 싶었지만 능력 부족으로 인해서...그냥... -->
            <div class="more">
                <span>더보기</span>
            </div>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'RankingList',
    props: {
        rankings: {
            type: Array,
            required: true,
        },
    },
    methods: {
        toggleLike(seq) {
            const item = this.rankings.find(item => item.seq === seq);
            if (item) {
                item.isLiked = !item.isLiked;
                item.likes += item.isLiked ? 1 : -1;
            }
        },
        toggleStar(seq) {
            const item = this.rankings.find(item => item.seq === seq);
            if (item) {
                item.isStar = !item.isStar;
                item.starCount += item.isStar ? 1 : -1;
            }
        }
    }
};
</script>

<style scoped>
.ranking-list h2 {
    text-align: center;
    margin-bottom: 20px;
}

.ranking-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 80%;
    margin: 10px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 20px;
    background-color: #f9f9f9;
}

.place-location {
    display: flex;
    flex-direction: column;
}

.place {
    font-weight: bold;
}

.location {
    margin-top: 5px; /* 순위와 주소 간의 간격 조정 */
    font-size: 0.8em;
    color: gray;
}

.icons {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
    width: 60px;
    text-align: right;
}

.icon-with-count {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.more {
    text-align: center;
    display: block;
    margin-top: 20px;
    cursor: pointer;
}
</style>
