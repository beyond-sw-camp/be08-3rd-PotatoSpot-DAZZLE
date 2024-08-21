<template>
    <div class="ranking-list">
        <h2 class="ranking-header">DAZZLE Ranking</h2>
        <ul>
            <li v-for="(item, index) in paginatedRankings" :key="item.id" class="ranking-item">
                <div class="place-location">
                    <span class="place">{{ index + 1 }}. {{ item.title }}</span>
                    <span class="location">{{ item.addr }}</span>
                </div>
                <div class="icons">
                    <div class="icon-with-count">
                        <span 
                            @click="toggleLike(item.id)" 
                            :class="item.isLiked ? 'material-symbols-rounded filled-heart' : 'material-symbols-outlined'">
                            favorite
                        </span>
                        <span class="likes">{{ item.likes }}</span>
                    </div>
                </div>
            </li>
        </ul>
        <div class="more" v-if="!isLastPage">
            <span @click="loadMore">더보기</span>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { usePhotoSpotStore } from '@/stores/photoSpotStore';

export default {
    name: 'RankingList',
    data() {
        return {
            itemsToShow: 5, 
        };
    },
    computed: {
        photoSpotStore() {
            return usePhotoSpotStore();
        },
        sortedRankings() {
            return this.photoSpotStore.photoSpots.slice().sort((a, b) => b.likes - a.likes);
        },
        paginatedRankings() {
            return this.sortedRankings.slice(0, this.itemsToShow);
        },
        isLastPage() {
            return this.itemsToShow >= this.sortedRankings.length;
        }
    },
    async created() {
        await this.photoSpotStore.fetchPhotoSpots(); 
    },
    methods: {
        toggleLike(id) {
            const item = this.photoSpotStore.photoSpots.find(item => item.id === id);
            if (item) {
                item.isLiked = !item.isLiked;
                item.likes += item.isLiked ? 1 : -1;
            }
        },
        loadMore() {
            if (!this.isLastPage) {
                this.itemsToShow += 5; 
            }
        }
    }
};
</script>

<style scoped>
.ranking-header {
  text-align: center; 
  margin-bottom: 20px; 
}

.ranking-list {
  max-width: 1200px; 
  width: 100%;
  margin: 0 auto; 
  padding: 20px; 
  box-sizing: border-box; 
  position: relative; 
  /*transform: translateX(-20px); */
  ul {
    padding-right: 32px;
  }
}

.ranking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0; 
  padding: 15px; 
  border: 1px solid #ddd;
  border-radius: 10px; 
  background-color: #f9f9f9;
  width: 100%; 
  box-sizing: border-box; 
}
.place-location {
  display: flex;
  flex-direction: column;
}

.place {
  font-weight: bold;
}

.location {
  margin-top: 5px;
  font-size: 0.9em;
  color: gray;
}

.icons {
  display: flex;
  align-items: center;
  gap: 10px; 
}

.icon-with-count {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.material-symbols-outlined {
  cursor: pointer;
  font-size: 24px;
  transition: color 0.3s;
  color: rgb(249, 207, 207); 
}

.filled-heart {
  color: red; 
}

.likes {
  margin-top: 5px; 
}

.more {
  text-align: center;
  display: block;
  margin-top: 20px;
  cursor: pointer;
}

</style>
