import { db } from '../../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const COLLECTION = 'gallery';

export async function GET() {
  try {
    if (!db) {
      return Response.json(
        { error: "Firestore database is not configured. Please fill in .env.local." },
        { status: 500 }
      );
    }

    const querySnapshot = await getDocs(collection(db, COLLECTION));
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ docId: doc.id, ...doc.data() });
    });

    // Sort items by id ascending to maintain consistent layout ordering
    items.sort((a, b) => (a.id || 0) - (b.id || 0));

    return Response.json(items);

  } catch (error) {
    console.error("❌ Gallery API error:", error);
    return Response.json({ error: error.message || "Failed to fetch gallery items" }, { status: 500 });
  }
}
