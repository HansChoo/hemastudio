import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { MOCK_PORTFOLIO } from '../constants';

export async function seedPortfoliosIfEmpty(): Promise<boolean> {
  const portfolioRef = collection(db, 'portfolios');
  const snapshot = await getDocs(portfolioRef);

  if (snapshot.size > 0) {
    return false;
  }

  const batch = MOCK_PORTFOLIO.map(async (item) => {
    const { id, ...data } = item;
    await addDoc(portfolioRef, {
      ...data,
      visible: true,
      createdAt: Timestamp.now(),
    });
  });

  await Promise.all(batch);
  console.log(`Seeded ${MOCK_PORTFOLIO.length} portfolio items to Firestore`);
  return true;
}
