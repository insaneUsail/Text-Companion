import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export const saveVocabulary = async ({
  userId,
  bookTitle,
  selectedText,
  aiAnswer,
}) => {
  await addDoc(
    collection(db, "users", userId, "vocabulary"),
    {
      bookTitle,
      selectedText,
      aiAnswer,
      savedAt: serverTimestamp(),
    }
  );
};