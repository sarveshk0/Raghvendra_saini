import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const COLLECTION = 'gallery';

export async function GET(request) {
  try {
    if (!db) {
      return Response.json(
        { error: "Firestore database is not configured. Please fill in .env.local." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const category = searchParams.get('category') || 'all';

    const querySnapshot = await getDocs(collection(db, COLLECTION));
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ docId: doc.id, id: doc.id, ...doc.data() });
    });

    // Sort items by id ascending to maintain consistent layout ordering
    items.sort((a, b) => (a.id || 0) - (b.id || 0));

    // Filter by category
    let filtered = items;
    if (category && category !== 'all') {
      filtered = items.filter(item => (item.cat || '').toLowerCase() === category.toLowerCase());
    }

    // Paginate if page parameter is specified
    if (pageParam !== null) {
      const page = Math.max(1, parseInt(pageParam || '1', 10));
      const limit = Math.max(1, parseInt(limitParam || '8', 10));
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      const startIdx = (page - 1) * limit;
      const endIdx = page * limit;
      const paginatedData = filtered.slice(startIdx, endIdx);

      return Response.json({
        data: paginatedData,
        total,
        page,
        limit,
        totalPages
      });
    }

    return Response.json(filtered);

  } catch (error) {
    console.error("❌ Gallery API error:", error);
    return Response.json({ error: error.message || "Failed to fetch gallery items" }, { status: 500 });
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

    const docId = item.firestoreId || item.docId || item.id;

    if (docId && typeof docId === 'string' && docId.length > 5) {
      const docRef = doc(db, COLLECTION, docId);
      const { firestoreId, docId: dId, id, ...updateData } = item;
      await updateDoc(docRef, updateData);
      return Response.json({ message: 'Gallery item updated in Firestore', data: item });
    } else {
      const newItem = {
        src: item.src || '',
        cat: item.cat || 'field',
        captionHi: item.captionHi || '',
        captionEn: item.captionEn || '',
        id: Date.now(),
      };
      const docRef = await addDoc(collection(db, COLLECTION), newItem);
      return Response.json({ message: 'Gallery item added to Firestore', data: { docId: docRef.id, id: docRef.id, ...newItem } });
    }
  } catch (error) {
    console.error('[gallery POST] Firestore error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('docId');

    if (!id) {
      return Response.json({ error: 'Missing gallery item ID parameter' }, { status: 400 });
    }

    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }

    await deleteDoc(doc(db, COLLECTION, id));
    return Response.json({ message: 'Gallery item deleted from Firestore' });
  } catch (error) {
    console.error('[gallery DELETE] Firestore error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}


