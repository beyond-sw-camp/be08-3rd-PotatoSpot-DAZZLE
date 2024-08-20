import { defineStore } from 'pinia';
import { ref } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const useUserStore = defineStore('user', () => {
  const firebaseUser = ref(null);
  const userEmail = ref('');
  const userName = ref('');  // 사용자 이름 상태
  const profilePic = ref(''); // 프로필 이미지 URL 상태
  const postCount = ref(0);  // 게시글 수 상태
  const totalLikes = ref(0); // 총 좋아요 수 상태

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      firebaseUser.value = user;
      userEmail.value = user.email;

      // Firestore에서 사용자 정보 가져오기
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userName.value = userData.name;
        profilePic.value = userData.profileImageUrl; // 프로필 이미지 URL 저장
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
      profilePic.value = ''; // 로그아웃 시 프로필 이미지 초기화
      postCount.value = 0;
      totalLikes.value = 0;
    }
  });

  return { firebaseUser, userEmail, userName, profilePic, postCount, totalLikes };
});
