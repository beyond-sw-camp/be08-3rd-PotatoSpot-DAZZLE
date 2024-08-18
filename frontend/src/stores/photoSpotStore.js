import { defineStore } from 'pinia';
import { ref } from 'vue';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export const usePhotoSpotStore = defineStore('photoSpot', () => {
  const photoSpots = ref([]);

  const fetchPhotoSpots = async () => {
    try {
      // 'regTime' 필드를 기준으로 내림차순으로 정렬합니다.
      const q = query(collection(db, 'photoSpots'), orderBy('regTime', 'desc'));
      const querySnapshot = await getDocs(q);
      photoSpots.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching photo spots:', error);
    }
  };

  return { photoSpots, fetchPhotoSpots };
});
