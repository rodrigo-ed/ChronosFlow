import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Save/update user profile in Firestore
    if (user) {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    return user;
  } catch (error: any) {
    console.error('Google Sign-in Error:', error);
    const customError = new Error(error?.message || 'Falha na autenticação com a conta Google');
    (customError as any).code = error?.code || '';
    throw customError;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(error?.message || 'Falha ao encerrar sessão');
  }
}

export function onUserAuthStateChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback, (error) => {
    console.warn('Auth observer error:', error);
  });
}
