import { defineStore } from 'pinia';
import { ref } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';


export const useUserStore = defineStore('user', () => {
    const firebaseUser = ref(null);
    const userEmail = ref('');

    onAuthStateChanged(auth, user => {
        firebaseUser.value = user;
        userEmail.value = user.email;
    });

    return { firebaseUser, userEmail };
});
