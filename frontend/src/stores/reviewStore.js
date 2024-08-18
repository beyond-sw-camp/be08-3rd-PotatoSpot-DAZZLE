// stores/review.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const useReviewStore = defineStore('review', () => {
    const reviews = ref([]);

    const fetchReviews = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'reviews'));
            reviews.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    return { reviews, fetchReviews };
});
