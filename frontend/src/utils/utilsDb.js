
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