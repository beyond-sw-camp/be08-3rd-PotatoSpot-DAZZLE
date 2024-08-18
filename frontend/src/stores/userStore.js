import { defineStore } from 'pinia';
import { ref } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const useUserStore = defineStore('user', () => {
  const firebaseUser = ref(null);
  const userEmail = ref('');
  const userName = ref('');  // 사용자 이름 상태 추가
  const postCount = ref(0);  // 게시글 수 상태 추가
  const totalLikes = ref(0); // 총 좋아요 수 상태 추가

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      firebaseUser.value = user;
      userEmail.value = user.email;

      // 사용자 이름 가져오기
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        userName.value = userDoc.data().name;
      }

      // 사용자의 게시글 수 및 총 좋아요 수 계산
      const postsQuery = query(collection(db, 'photoSpots'), where('userEmail', '==', user.email));
      const postDocs = await getDocs(postsQuery);
      postCount.value = postDocs.size;
      totalLikes.value = postDocs.docs.reduce((sum, doc) => sum + (doc.data().likes || 0), 0);
    } else {
      firebaseUser.value = null;
      userEmail.value = '';
      userName.value = '';
      postCount.value = 0;
      totalLikes.value = 0;
    }
  });

  return { firebaseUser, userEmail, userName, postCount, totalLikes };
});
