import { defineStore } from 'pinia';
import { ref } from 'vue';
import { collection, getDocs, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

export const usePhotoSpotStore = defineStore('photoSpot', () => {
  const photoSpots = ref([]);

  const fetchPhotoSpots = async () => {
    try {
      // 'regTime' 필드를 기준으로 내림차순으로 정렬
      const q = query(collection(db, 'photoSpots'), orderBy('regTime', 'desc'));
      const querySnapshot = await getDocs(q);
      photoSpots.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching photo spots:', error);
    }
  };

  const incrementLikes = async (spotId) => {
    try {
      // Firestore에서 해당 스팟의 좋아요 수를 1 증가시키는 API 호출
      const spotDoc = doc(db, 'photoSpots', spotId);
      await updateDoc(spotDoc, {
        likes: increment(1)
      });

      // 로컬 상태 업데이트
      const spot = photoSpots.value.find(spot => spot.id === spotId);
      if (spot) {
        spot.likes += 1;
      }
    } catch (error) {
      console.error('Error incrementing like:', error);
    }
  };

  return { photoSpots, fetchPhotoSpots, incrementLikes };
});
