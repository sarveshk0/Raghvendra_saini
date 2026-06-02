/**
 * Timeline API Route — Pure Cloud Firestore
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

const COLLECTION = 'timeline';

export async function GET() {
  try {
    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }
    const snap = await getDocs(collection(db, COLLECTION));
    const timeline = snap.docs.map(d => ({ firestoreId: d.id, id: d.id, ...d.data() }));
    
    // Sort timeline chronologically by their internal database id
    timeline.sort((a, b) => (a.id || 0) - (b.id || 0));
    return Response.json(timeline);
  } catch (err) {
    console.error('[timeline GET] Firestore error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const role = await request.json();
    if (!role) {
      return Response.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }

    const docId = role.firestoreId || role.id;

    if (docId && typeof docId === 'string' && docId.length > 5) {
      // Edit existing document
      const docRef = doc(db, COLLECTION, docId);
      const { firestoreId, id, ...updateData } = role;
      await updateDoc(docRef, updateData);
      return Response.json({ message: 'Timeline role updated in Firestore', data: role });
    } else {
      // Add a new document
      const newRole = {
        year: role.year || 'Present',
        roleHi: role.roleHi || 'नयी सांगठनिक भूमिका',
        roleEn: role.roleEn || role.role || 'New Organizational Role',
        orgHi: role.orgHi || 'संगठन नाम',
        orgEn: role.orgEn || role.org || 'Organization Name',
        cat: role.cat || 'political',
        active: role.active || false,
        id: Date.now(), // timestamp id for custom sorting support
      };
      const docRef = await addDoc(collection(db, COLLECTION), newRole);
      return Response.json({ message: 'Timeline role added to Firestore', data: { firestoreId: docRef.id, id: docRef.id, ...newRole } });
    }
  } catch (error) {
    console.error('[timeline POST] Firestore error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('firestoreId');

    if (!id) {
      return Response.json({ error: 'Missing timeline role ID parameter' }, { status: 400 });
    }

    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }

    await deleteDoc(doc(db, COLLECTION, id));
    return Response.json({ message: 'Timeline role deleted from Firestore' });
  } catch (error) {
    console.error('[timeline DELETE] Firestore error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
