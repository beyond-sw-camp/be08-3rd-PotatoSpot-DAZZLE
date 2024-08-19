import { defineStore } from 'pinia';
import { ref } from 'vue';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export const useReviewStore = defineStore('review', () => {
  const comments = ref([]);

  const fetchComments = async (spotId) => {
    try {
      const q = query(collection(db, 'comments'), where('spotId', '==', spotId));
      const querySnapshot = await getDocs(q);
      comments.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  return { comments, fetchComments };
});
