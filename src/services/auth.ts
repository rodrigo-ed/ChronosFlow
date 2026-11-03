import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

export async function saveUserProfile(user: User): Promise<void> {
  try {
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
  } catch (err) {
    console.warn('Could not save user profile to Firestore:', err);
  }
}

export async function signInWithGoogle(preferRedirect = false): Promise<User | null> {
  try {
    if (preferRedirect) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (user) {
      await saveUserProfile(user);
    }

    return user;
  } catch (error: any) {
    console.error('Google Sign-in Error:', error);
    // If popup was blocked by mobile browser, fallback to redirect
    if (error?.code === 'auth/popup-blocked') {
      try {
        await signInWithRedirect(auth, googleProvider);
        return null;
      } catch (redirectError: any) {
        throw redirectError;
      }
    }
    const customError = new Error(error?.message || 'Falha na autenticação com a conta Google');
    (customError as any).code = error?.code || '';
    throw customError;
  }
}

export async function checkRedirectResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      await saveUserProfile(result.user);
      return result.user;
    }
  } catch (err: any) {
    console.warn('Redirect result error:', err);
  }
  return null;
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

