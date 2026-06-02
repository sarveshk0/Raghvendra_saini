/**
 * Organizational RSS Work API Route — Pure Cloud Firestore
 */
import { db } from '../../../lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

const COLLECTION = 'organizational';

export async function GET() {
  try {
    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }
    const snap = await getDocs(collection(db, COLLECTION));
    const items = snap.docs.map(d => ({ firestoreId: d.id, id: d.id, ...d.data() }));
    
    // Sort items chronologically or sequentially by id ascending
    items.sort((a, b) => (a.id || 0) - (b.id || 0));
    return Response.json(items);
  } catch (err) {
    console.error('[organizational GET] Firestore error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const item = await request.json();
    if (!item) {
      return Response.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }

    const docId = item.firestoreId || item.id;

    if (docId && typeof docId === 'string' && docId.length > 5) {
      // Edit existing document
      const docRef = doc(db, COLLECTION, docId);
      const { firestoreId, id, ...updateData } = item;
      await updateDoc(docRef, updateData);
      return Response.json({ message: 'Organizational work updated in Firestore', data: item });
    } else {
      // Add a new document
      const newItem = {
        titleHi: item.titleHi || 'नया सांगठनिक कार्य',
        titleEn: item.titleEn || 'New Organizational Achievement',
        id: Date.now(), // Unique sorting id
      };
      const docRef = await addDoc(collection(db, COLLECTION), newItem);
      return Response.json({ message: 'Organizational work added to Firestore', data: { firestoreId: docRef.id, id: docRef.id, ...newItem } });
    }
  } catch (error) {
    console.error('[organizational POST] Firestore error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('firestoreId');

    if (!id) {
      return Response.json({ error: 'Missing ID parameter' }, { status: 400 });
    }

    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }

    await deleteDoc(doc(db, COLLECTION, id));
    return Response.json({ message: 'Organizational work deleted from Firestore' });
  } catch (error) {
    console.error('[organizational DELETE] Firestore error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
