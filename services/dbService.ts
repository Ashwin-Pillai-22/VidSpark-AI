
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc,
  getDocs, 
  query, 
  where,
  increment
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { VideoIdea, UserProfile } from "../types";

const COLLECTION_NAME = "saved_ideas";
const USAGE_COLLECTION = "daily_usage";
const PROFILE_COLLECTION = "profiles";

const getUsageDocId = (userId: string) => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  return `${userId}_${dateStr}`;
};

export const saveIdeaToDb = async (userId: string, idea: VideoIdea) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, idea.id);
    await setDoc(docRef, {
      ...idea,
      userId,
      savedAt: Date.now(),
    });
  } catch (error) {
    console.error("Error saving idea to Firestore:", error);
    throw error;
  }
};

export const deleteIdeaFromDb = async (ideaId: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, ideaId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting idea from Firestore:", error);
    throw error;
  }
};

export const getUserSavedIdeas = async (userId: string): Promise<VideoIdea[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    const ideas = snapshot.docs.map((doc) => doc.data() as VideoIdea);
    return ideas.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  } catch (error) {
    console.error("Error fetching saved ideas from Firestore:", error);
    throw error;
  }
};

export const logGeneration = async (userId: string) => {
  try {
    const docId = getUsageDocId(userId);
    const usageRef = doc(db, USAGE_COLLECTION, docId);
    // Use increment(1) to ensure the count is correctly updated in the database
    await setDoc(usageRef, {
      userId,
      count: increment(1),
      lastUpdated: Date.now()
    }, { merge: true });
  } catch (error) {
    console.error("Error logging generation:", error);
  }
};

export const getTodayGenerationCount = async (userId: string): Promise<number> => {
  try {
    const docId = getUsageDocId(userId);
    const usageRef = doc(db, USAGE_COLLECTION, docId);
    const docSnap = await getDoc(usageRef);

    if (docSnap.exists()) {
      return docSnap.data().count || 0;
    }
    return 0;
  } catch (error) {
    console.error("Error getting daily count:", error);
    return 0;
  }
};

export const saveUserProfile = async (profile: UserProfile) => {
  try {
    const profileRef = doc(db, PROFILE_COLLECTION, profile.uid);
    await setDoc(profileRef, {
      ...profile,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (error) {
    console.error("Error saving profile:", error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const profileRef = doc(db, PROFILE_COLLECTION, uid);
    const docSnap = await getDoc(profileRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};
