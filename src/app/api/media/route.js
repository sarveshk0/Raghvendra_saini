/**
 * Media API Route — Pure Cloud Firestore
 */
import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const COLLECTION = 'media';

export async function GET(request) {
  try {
    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    const snap = await getDocs(collection(db, COLLECTION));
    const media = snap.docs.map(d => ({ firestoreId: d.id, id: d.id, ...d.data() }));
    // Sort media chronologically by id ascending
    media.sort((a, b) => (a.id || 0) - (b.id || 0));

    if (pageParam !== null) {
      const page = parseInt(pageParam || '1', 10);
      const limit = parseInt(limitParam || '6', 10);
      const total = media.length;
      const totalPages = Math.ceil(total / limit);
      const startIdx = (page - 1) * limit;
      const endIdx = page * limit;
      const paginatedData = media.slice(startIdx, endIdx);

      return Response.json({
        data: paginatedData,
        total,
        page,
        limit,
        totalPages
      });
    }

    return Response.json(media);
  } catch (err) {
    console.error('[media GET] Firestore error:', err);
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
      return Response.json({ message: 'Media updated in Firestore', data: item });
    } else {
      const newItem = {
        title: item.title || 'नवीनतम समाचार विमर्श',
        outlet: item.outlet || 'News Outlet',
        type: item.type || 'interview',
        date: item.date || new Date().toISOString().split('T')[0],
        id: Date.now(),
      };
      const docRef = await addDoc(collection(db, COLLECTION), newItem);
      return Response.json({ message: 'Media added to Firestore', data: { firestoreId: docRef.id, id: docRef.id, ...newItem } });
    }
  } catch (error) {
    console.error('[media POST] Firestore error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('firestoreId');

    if (!id) {
      return Response.json({ error: 'Missing media ID parameter' }, { status: 400 });
    }

    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }

    await deleteDoc(doc(db, COLLECTION, id));
    return Response.json({ message: 'Media deleted from Firestore' });
  } catch (error) {
    console.error('[media DELETE] Firestore error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
