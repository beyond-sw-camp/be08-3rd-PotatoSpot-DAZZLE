
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export const postReview = async (postId, userEmail, content) => {
  try {
    const docRef = await addDoc(collection(db, "reviews"), {
      postId: postId,
      userEmail: userEmail,
      content: content
    });
    console.log("문서 ID: ", docRef.id);
  } catch (e) {
    console.error("에러 메시지: ", e);
  }
};

export const postPhotoSpot = async (userEmail, title, content, imgUrl, place, addr, x, y, likes, regTime) => {
  try {
    const docRef = await addDoc(collection(db, "photoSpots"), {
      userEmail: userEmail,   // 사용자 email
      title: title,   // 제목
      content: content,   // 내용
      imgUrl: imgUrl, // 이미지 주소
      place: place,   // 장소
      addr: addr,     // 주소
      x: x,       // x 좌표
      y: y,       // y 좌표
      likes: likes,   // 좋아요
      regTime: regTime    // 등록 시간
    });
    console.log('문서 ID: ', docRef.id);
  } catch (e) {
    console.error("에러 메시지: ", e);
  }
}

// 포토스팟의 likes 필드를 증가시키는 함수
export const incrementLikes = async (photoSpotId) => {
  try {
    const photoSpotRef = doc(db, "photoSpots", photoSpotId);
    await updateDoc(photoSpotRef, {
      likes: increment(1) // likes 필드의 값을 1 증가
    });
    console.log('Likes 증가 성공');
  } catch (e) {
    console.error("에러 메시지: ", e);
  }
};