import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || 'Admin';

if (!email || !password) {
  console.error('Usage: npx tsx scripts/setup-admin.ts <email> <password> [name]');
  process.exit(1);
}

async function main() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    await setDoc(doc(db, 'users', uid), {
      id: uid,
      name,
      email,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
      isAdmin: true,
      joinDate: new Date().toISOString().split('T')[0],
    });

    console.log(`Admin account created successfully!`);
    console.log(`  Email: ${email}`);
    console.log(`  UID: ${uid}`);
    console.log(`  isAdmin: true`);
    process.exit(0);
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      console.error('This email is already registered. Please use a different email or set isAdmin manually in Firestore.');
    } else {
      console.error('Error:', err.message);
    }
    process.exit(1);
  }
}

main();
