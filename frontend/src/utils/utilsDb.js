import { db } from "../firebase";
import { collection, addDoc, updateDoc, increment, doc } from "firebase/firestore";


export const postComment = async (spotId, userEmail, content) => {
  try {
    const docRef = await addDoc(collection(db, "comments"), {
      spotId: spotId,
      userEmail: userEmail,
      content: content,
      timestamp: new Date(), // 댓글 작성 시간
    });
    console.log("문서 ID: ", docRef.id);
  } catch (e) {
    console.error("에러 메시지: ", e);
  }
};

export const postPhotoSpot = async (
  userEmail,
  title,
  content,
  imgUrl,
  place,
  addr,
  x,
  y,
  likes,
  regTime
) => {
  try {
    const docRef = await addDoc(collection(db, "photoSpots"), {
      userEmail: userEmail, // 사용자 email
      title: title, // 제목
      content: content, // 내용
      imgUrl: imgUrl, // 이미지 주소
      place: place, // 장소
      addr: addr, // 주소
      x: x, // x 좌표
      y: y, // y 좌표
      likes: likes, // 좋아요
      regTime: regTime, // 등록 시간
    });
    console.log("문서 ID: ", docRef.id);
  } catch (e) {
    console.error("에러 메시지: ", e);
  }
};

export const incrementLikes = async (spotId) => {
  try {
    // Firestore에서 해당 문서를 참조합니다.
    const spotRef = doc(db, "photoSpots", spotId);
    
    // likes 값을 1 증가시킵니다.
    await updateDoc(spotRef, {
      likes: increment(1),
    });
  } catch (error) {
    console.error("Error incrementing likes:", error);
  }
};
