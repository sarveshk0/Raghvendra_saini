/**
 * Thoughts API Route — Pure Cloud Firestore
 * Supports: search, category, status, page, limit query params on GET
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

export async function GET(request) {
  try {
    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search   = (searchParams.get('search')   || '').toLowerCase().trim();
    const category = (searchParams.get('category') || '').toLowerCase().trim();
    const status   = (searchParams.get('status')   || '').toLowerCase().trim();
    const page     = Math.max(1, parseInt(searchParams.get('page')  || '1', 10));
    const limit    = Math.max(0, parseInt(searchParams.get('limit') || '0', 10)); // 0 = no limit / return all

    const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
    const snap = await getDocs(q);

    // Map document IDs to firestoreId and id to be fully compatible with frontend states
    let thoughts = snap.docs.map(d => ({ firestoreId: d.id, id: d.id, ...d.data() }));

    // ── Filter by search (title Hindi / English / tags) ──────────────────────
    if (search) {
      thoughts = thoughts.filter(t =>
        (t.titleHi || '').toLowerCase().includes(search) ||
        (t.titleEn || '').toLowerCase().includes(search) ||
        (t.descHi  || '').toLowerCase().includes(search) ||
        (t.descEn  || '').toLowerCase().includes(search) ||
        (Array.isArray(t.tags) && t.tags.some(tag => tag.toLowerCase().includes(search)))
      );
    }

    // ── Filter by category (tags-based) ──────────────────────────────────────
    if (category && category !== 'all') {
      thoughts = thoughts.filter(t =>
        Array.isArray(t.tags) && t.tags.some(tag => tag.toLowerCase() === category)
      );
    }

    // ── Filter by status ──────────────────────────────────────────────────────
    if (status && status !== 'all') {
      thoughts = thoughts.filter(t => (t.status || '').toLowerCase() === status);
    }

    const total = thoughts.length;

    // ── Pagination ────────────────────────────────────────────────────────────
    let paginated = thoughts;
    let totalPages = 1;
    if (limit > 0) {
      totalPages = Math.max(1, Math.ceil(total / limit));
      const safeP = Math.min(page, totalPages);
      paginated = thoughts.slice((safeP - 1) * limit, safeP * limit);
    }

    // If no pagination requested, return bare array for backward compatibility
    if (limit === 0 && !search && !category && !status) {
      return Response.json(thoughts);
    }

    return Response.json({
      data: paginated,
      total,
      page,
      totalPages,
      limit
    });
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
