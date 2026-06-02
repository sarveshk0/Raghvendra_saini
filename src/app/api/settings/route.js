/**
 * Settings API Route — Pure Cloud Firestore
 */
import { db } from '../../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const COLLECTION = 'settings';
const DOC_ID = 'main';

export async function GET() {
  try {
    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }
    const docRef = doc(db, COLLECTION, DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return Response.json(snap.data());
    }
    return Response.json({ error: 'Settings not found in Firestore' }, { status: 404 });
  } catch (err) {
    console.error('[settings GET] Firestore error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newSettings = await request.json();
    if (!newSettings) return Response.json({ error: 'Invalid settings payload' }, { status: 400 });

    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }

    const docRef = doc(db, COLLECTION, DOC_ID);
    await setDoc(docRef, newSettings);
    return Response.json({ message: 'Settings updated in Firestore', data: newSettings });
  } catch (error) {
    console.error('[settings POST] Firestore error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
