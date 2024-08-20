import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase'; // storage 추가
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // storage 관련 메서드 추가

export const loginUser = async (email, password, rememberMe) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    // Remember Me 체크박스가 체크되었는지 확인
    if (rememberMe) {
      localStorage.setItem('userEmail', email);
    } else {
      localStorage.removeItem('userEmail');
    }
  } catch (error) {
    throw error;
  }
};

// 사용자 등록
export const registerUser = async (email, password, name, imageFile) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User registered:', user);

    // 이미지 업로드 후 Firestore에 사용자 정보 저장
    const imageUrl = await uploadProfileImage(user.uid, imageFile);
    await saveUserToDb(user, name, imageUrl);
  } catch (error) {
    console.error('Error registering:', error);
  }
};

// Firebase Storage에 프로필 이미지 업로드
const uploadProfileImage = async (uid, imageFile) => {
  try {
    const storageRef = ref(storage, `profileImages/${uid}`);
    await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Profile image uploaded:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile image:', error);
  }
};

// Firestore에 사용자 정보 저장
const saveUserToDb = async (user, name, imageUrl) => {
  try {
    const userDoc = doc(db, 'users', user.uid);
    await setDoc(userDoc, {
      email: user.email,
      uid: user.uid,
      name: name,
      profileImageUrl: imageUrl, // 프로필 이미지 URL 추가
    });
    console.log('User info saved to Firestore');
  } catch (error) {
    console.error('Error saving user info to Firestore:', error);
  }
};

// 사용자 프로필 업데이트 함수
export const updateUserProfile = async (user, newName, newImageFile) => {
  try {
    const userDocRef = doc(db, 'users', user.uid);

    // Firestore에서 기존 사용자 데이터 가져오기
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.exists() ? userDoc.data() : null;

    let imageUrl = userData?.profileImageUrl || null;

    // 새로운 이미지가 있으면 기존 이미지를 삭제하고 새 이미지를 업로드
    if (newImageFile) {
      if (imageUrl) {
        // 기존 이미지 삭제
        const oldImageRef = ref(storage, imageUrl);
        await deleteObject(oldImageRef);
      }

      // 새 이미지 업로드
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(storageRef, newImageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Firestore에 사용자 이름 및 이미지 URL 업데이트
    const updatedData = {
      name: newName,
    };

    if (imageUrl) {
      updatedData.profileImageUrl = imageUrl;
    }

    await updateDoc(userDocRef, updatedData);

    console.log('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};