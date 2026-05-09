import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const saveUserToFirestore = async (user) => {
  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
  }
};