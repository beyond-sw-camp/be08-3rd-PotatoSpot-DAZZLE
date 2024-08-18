import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// 사용자 로그인
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User logged in:', user);
    } catch (error) {
        console.error('Error logging in:', error);
    }
};

// 사용자 등록
export const registerUser = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User registered:', user);
        await saveUserToDb(user, name);
    } catch (error) {
        console.error('Error registering:', error);
    }
};

// Firestore에 사용자 정보 저장
const saveUserToDb = async (user, name) => {
    try {
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
            email: user.email,
            uid: user.uid,
            name: name
        });
        console.log('User info saved to Firestore');
    } catch (error) {
        console.error('Error saving user info to Firestore:', error);
    }
};
