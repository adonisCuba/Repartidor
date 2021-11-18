import { getAuth } from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";

const createDelivery = async (delivery) => {
  const firestore = getFirestore();
  const document = await addDoc(collection(firestore, "deliveries"), delivery);
  return document;
};

const updateDelivery = async (id, delivery) => {
  const firestore = getFirestore();
  const document = await setDoc(doc(firestore, "deliveries", id), delivery);
  return document;
};

const removeDelivery = async (id) => {
  const firestore = getFirestore();
  await deleteDoc(doc(firestore, "deliveries", id));
};
const getDeliveries = async (state = "all") => {
  const userId = getAuth().currentUser.uid;
  const firestore = getFirestore();
  let q = null;
  if (state == "all") {
    q = query(
      collection(firestore, "deliveries"),
      where("userId", "==", userId)
    );
  } else
    q = query(
      collection(firestore, "deliveries"),
      where("state", "==", state),
      where("userId", "==", userId)
    );
  const queryResult = await getDocs(q);
  const data = [];
  queryResult.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  return data;
};
const getDeliveriesBoy = async () => {
  const userId = getAuth().currentUser.uid;
  const firestore = getFirestore();
  let q = query(
    collection(firestore, "deliveries"),
    where("boyId", "==", userId)
  );
  let queryResult = await getDocs(q);
  const data = [];
  queryResult.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  q = query(
    collection(firestore, "deliveries"),
    where("state", "==", "available")
  );
  queryResult = await getDocs(q);
  queryResult.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  return data;
};

const getDelivery = async (id) => {
  const firestore = getFirestore();
  const docRef = doc(firestore, "deliveries", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return undefined;
  }
};

const takeDelivery = async (id, userId) => {
  const firestore = getFirestore();
  const document = await updateDoc(doc(firestore, "deliveries", id), {
    boyId: userId,
    state: "taked",
  });
  return document;
};
const releaseDelivery = async (id) => {
  const firestore = getFirestore();
  const document = await updateDoc(doc(firestore, "deliveries", id), {
    boyId: deleteField(),
    state: "available",
  });
  return document;
};
const confirmDelivery = async (id, imagenUrl = null, videoUrl = null) => {
  const firestore = getFirestore();
  let data;
  if (imagenUrl) data = { imagenUrl, state: "delivered" };
  else data = { videoUrl, state: "delivered" };
  const document = await updateDoc(doc(firestore, "deliveries", id), data);
  return document;
};

export {
  createDelivery,
  getDeliveries,
  getDelivery,
  updateDelivery,
  removeDelivery,
  getDeliveriesBoy,
  takeDelivery,
  releaseDelivery,
  confirmDelivery,
};
