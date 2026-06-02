/**
 * Documents API Route — Pure Cloud Firestore
 */
import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const COLLECTION = 'documents';

export async function GET() {
  try {
    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }
    const snap = await getDocs(collection(db, COLLECTION));
    const docs = snap.docs.map(d => ({ firestoreId: d.id, id: d.id, ...d.data() }));
    // Sort documents by id ascending
    docs.sort((a, b) => (a.id || 0) - (b.id || 0));
    return Response.json(docs);
  } catch (err) {
    console.error('[documents GET] Firestore error:', err);
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
      const docRef = doc(db, COLLECTION, docId);
      const { firestoreId, id, ...updateData } = item;
      await updateDoc(docRef, updateData);
      return Response.json({ message: 'Document updated in Firestore', data: item });
    } else {
      const newDoc = {
        name: item.name || 'नया दस्तावेज़.pdf',
        cat: item.cat || 'certificate',
        date: item.date || new Date().toISOString().split('T')[0],
        pub: item.pub !== undefined ? item.pub : true,
        id: Date.now(),
      };
      const docRef = await addDoc(collection(db, COLLECTION), newDoc);
      return Response.json({ message: 'Document added to Firestore', data: { firestoreId: docRef.id, id: docRef.id, ...newDoc } });
    }
  } catch (error) {
    console.error('[documents POST] Firestore error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('firestoreId');

    if (!id) {
      return Response.json({ error: 'Missing document ID parameter' }, { status: 400 });
    }

    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }

    await deleteDoc(doc(db, COLLECTION, id));
    return Response.json({ message: 'Document deleted from Firestore' });
  } catch (error) {
    console.error('[documents DELETE] Firestore error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
