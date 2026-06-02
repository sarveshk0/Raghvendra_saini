/**
 * Thoughts API Route — Pure Cloud Firestore
 */
import { db } from '../../../lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';

const COLLECTION = 'thoughts';

export async function GET() {
  try {
    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }
    const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    
    // Map document IDs to firestoreId and id to be fully compatible with frontend states
    const thoughts = snap.docs.map(d => ({ firestoreId: d.id, id: d.id, ...d.data() }));
    return Response.json(thoughts);
  } catch (err) {
    console.error('[thoughts GET] Firestore error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const thought = await request.json();
    if (!thought) {
      return Response.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }

    const docId = thought.firestoreId || thought.id;

    // Check if updating an existing Firestore document
    if (docId && typeof docId === 'string' && docId.length > 5) {
      const docRef = doc(db, COLLECTION, docId);
      const { firestoreId, id, ...updateData } = thought;
      await updateDoc(docRef, updateData);
      return Response.json({ message: 'Thought updated in Firestore', data: thought });
    } else {
      // Add a new Firestore document
      const newThought = {
        titleHi: thought.titleHi || 'नया विचार शीर्षक',
        titleEn: thought.titleEn || 'New Thought Title',
        descHi: thought.descHi || '',
        descEn: thought.descEn || '',
        status: thought.status || 'draft',
        date: thought.date || new Date().toISOString().split('T')[0],
        tags: thought.tags || [],
        views: thought.views || 0,
      };
      const docRef = await addDoc(collection(db, COLLECTION), newThought);
      return Response.json({ message: 'Thought added to Firestore', data: { firestoreId: docRef.id, id: docRef.id, ...newThought } });
    }
  } catch (error) {
    console.error('[thoughts POST] Firestore error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('firestoreId');

    if (!id) {
      return Response.json({ error: 'Missing thought ID parameter' }, { status: 400 });
    }

    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }

    await deleteDoc(doc(db, COLLECTION, id));
    return Response.json({ message: 'Thought deleted from Firestore' });
  } catch (error) {
    console.error('[thoughts DELETE] Firestore error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
