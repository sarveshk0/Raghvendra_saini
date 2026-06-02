/**
 * Community API Route — Pure Cloud Firestore
 */
import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const COLLECTION = 'community';

export async function GET() {
  try {
    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }
    const snap = await getDocs(collection(db, COLLECTION));
    const community = snap.docs.map(d => ({ firestoreId: d.id, id: d.id, ...d.data() }));
    // Sort community items by id ascending
    community.sort((a, b) => (a.id || 0) - (b.id || 0));
    return Response.json(community);
  } catch (err) {
    console.error('[community GET] Firestore error:', err);
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
      return Response.json({ message: 'Community item updated in Firestore', data: item });
    } else {
      const newItem = {
        titleHi: item.titleHi || 'नया लोक सेवा कार्यक्रम',
        titleEn: item.titleEn || 'New Social Initiative',
        beneficiariesHi: item.beneficiariesHi || '0+',
        beneficiariesEn: item.beneficiariesEn || '0+',
        areaHi: item.areaHi || 'उत्तर प्रदेश',
        areaEn: item.areaEn || 'Uttar Pradesh',
        year: item.year || new Date().getFullYear().toString(),
        descHi: item.descHi || '',
        descEn: item.descEn || '',
        detailsHi: item.detailsHi || '',
        detailsEn: item.detailsEn || '',
        icon: item.icon || '🤝',
        accent: item.accent || 'card-accent-green',
        iconBg: item.iconBg || 'bg-[#E1F5EE] text-[#1D9E75]',
        id: Date.now(),
      };
      const docRef = await addDoc(collection(db, COLLECTION), newItem);
      return Response.json({ message: 'Community item added to Firestore', data: { firestoreId: docRef.id, id: docRef.id, ...newItem } });
    }
  } catch (error) {
    console.error('[community POST] Firestore error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('firestoreId');

    if (!id) {
      return Response.json({ error: 'Missing community ID parameter' }, { status: 400 });
    }

    if (!db) {
      return Response.json(
        { error: 'Firestore is not configured. Setup credentials in .env.local' },
        { status: 500 }
      );
    }

    await deleteDoc(doc(db, COLLECTION, id));
    return Response.json({ message: 'Community item deleted from Firestore' });
  } catch (error) {
    console.error('[community DELETE] Firestore error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
