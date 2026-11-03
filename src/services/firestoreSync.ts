import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

export async function saveUserItems<T extends { id: string }>(
  userId: string,
  subcollection: string,
  items: T[]
): Promise<void> {
  if (!userId) return;
  try {
    const colRef = collection(db, 'users', userId, subcollection);
    const batch = writeBatch(db);

    for (const item of items) {
      const docRef = doc(colRef, item.id);
      batch.set(docRef, item, { merge: true });
    }

    await batch.commit();
  } catch (error) {
    console.warn(`Error syncing ${subcollection} to Firestore:`, error);
  }
}

export async function loadUserItems<T>(
  userId: string,
  subcollection: string
): Promise<T[]> {
  if (!userId) return [];
  try {
    const colRef = collection(db, 'users', userId, subcollection);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => d.data() as T);
  } catch (error) {
    console.warn(`Error loading ${subcollection} from Firestore:`, error);
    return [];
  }
}

export async function deleteUserItem(
  userId: string,
  subcollection: string,
  itemId: string
): Promise<void> {
  if (!userId) return;
  try {
    const docRef = doc(db, 'users', userId, subcollection, itemId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn(`Error deleting ${subcollection}/${itemId}:`, error);
  }
}
