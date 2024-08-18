import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase'; // firebase.js에서 가져온 storage 객체

export const uploadImage = async (file) => {
    if (!file) return;

    // Firebase Storage에 저장할 참조 생성
    const fileRef = storageRef(storage, `images/${file.name}`);

    try {
        // 파일 업로드
        const snapshot = await uploadBytes(fileRef, file);

        // 업로드 완료 후 다운로드 URL 가져오기
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading file: ", error);
    }
};