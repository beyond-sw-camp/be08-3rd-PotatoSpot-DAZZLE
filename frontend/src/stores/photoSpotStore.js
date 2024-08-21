import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { collection, getDocs, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

export const usePhotoSpotStore = defineStore('photoSpot', () => {
  const photoSpots = ref([]);

  const fetchPhotoSpots = async () => {
    try {
      const q = query(collection(db, 'photoSpots'), orderBy('regTime', 'desc'));
      const querySnapshot = await getDocs(q);
      photoSpots.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching photo spots:', error);
    }
  };

  const incrementLikes = async (spotId) => {
    try {
      const spotDoc = doc(db, 'photoSpots', spotId);
      await updateDoc(spotDoc, {
        likes: increment(1)
      });

      const spot = photoSpots.value.find(spot => spot.id === spotId);
      if (spot) {
        spot.likes += 1;
      }
    } catch (error) {
      console.error('Error incrementing like:', error);
    }
  };

  // 전체 게시글 수 계산
  const totalPosts = computed(() => photoSpots.value.length);

  // 오늘 올라온 게시글 수 계산
  const todayPosts = computed(() => {
    const today = new Date();
    return photoSpots.value.filter(spot => {
      const regDate = new Date(spot.regTime.seconds * 1000);
      return regDate.toDateString() === today.toDateString();
    }).length;
  });

  // 전체 좋아요 수 계산
  const totalLikes = computed(() => {
    return photoSpots.value.reduce((acc, spot) => acc + spot.likes, 0);
  });

  return { photoSpots, fetchPhotoSpots, incrementLikes, totalPosts, todayPosts, totalLikes };
});
