import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "./firebase";

export const saveBookToFirestore =
  async ({
    userId,
    title,
    fileUrl,
  }) => {

    try {

      await addDoc(
        collection(
          db,
          "users",
          userId,
          "books"
        ),
        {
          title,
          fileUrl,
          currentPage: 1,
          addedAt: serverTimestamp(),
        }
      );

    } catch (error) {

      console.log(error);

    }
};

export const getUserBooks =
  async (userId) => {

    const booksRef = collection(
      db,
      "users",
      userId,
      "books"
    );

    const q = query(
      booksRef,
      orderBy("addedAt", "desc")
    );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );
};