/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";
import { getCachedUser, setCachedUser } from "../utils/dashboardCache";

const AuthContext = createContext(null);

// ─── Admin Single Account Policy ───────────────────────────────────────────
// Only the designated primary account receives role: "admin".
// All other accounts registering or signing in are strictly role: "user".
const PRIMARY_ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "rebhedwip6@gmail.com").trim().toLowerCase();
const isAdminEmail = (email) =>
  email ? email.trim().toLowerCase() === PRIMARY_ADMIN_EMAIL : false;
// ─────────────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const withTimeout = (promise, ms = 3000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Firestore operation timed out")), ms)
    ),
  ]);
};

export const AuthProvider = ({ children }) => {
  const cachedUser = getCachedUser();
  const [user, setUserState] = useState(cachedUser);
  const [loading, setLoading] = useState(!cachedUser);

  const setUser = useCallback((usr) => {
    setUserState(usr);
    setCachedUser(usr);
  }, []);

  // Synchronize Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let userData = null;
        try {
          if (db) {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await withTimeout(getDoc(userDocRef), 3000);
            if (userDoc && userDoc.exists()) {
              userData = userDoc.data();
            }
          }
        } catch (error) {
          console.warn("Firestore user profile fetch timed out/failed:", error.message);
        }

        // Enforce admin role from whitelist — overrides whatever is in Firestore
        const resolvedRole = isAdminEmail(firebaseUser.email)
          ? "admin"
          : userData?.role || "user";

        // If Firestore role doesn't match whitelist, silently sync it
        if (db && userData && userData.role !== resolvedRole) {
          withTimeout(
            setDoc(doc(db, "users", firebaseUser.uid), { role: resolvedRole }, { merge: true }),
            3000
          ).catch(() => { });
        }

        const userObj = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: userData?.name || firebaseUser.displayName || "User",
          photoURL: firebaseUser.photoURL,
          phoneNumber: userData?.phone || firebaseUser.phoneNumber || "",
          status: userData?.status || "active",
          ...userData,
          role: resolvedRole, // explicit override last so spread doesn't clobber it
        };

        setUser(userObj);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  // Signup Flow - Creates account without authenticating session or saving token
  const signup = useCallback(async (email, password, fullName, phoneNumber) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    try {
      await updateProfile(firebaseUser, { displayName: fullName });
    } catch (pErr) {
      console.warn("Could not update profile display name:", pErr.message);
    }

    // Whitelist check: admin email gets admin role even on fresh signup
    const signupRole = isAdminEmail(email) ? "admin" : "user";

    const userProfile = {
      uid: firebaseUser.uid,
      name: fullName || "",
      email: email || "",
      phone: phoneNumber || "",
      role: signupRole,
      status: "active",
      photoURL: firebaseUser.photoURL || "",
      emailVerified: firebaseUser.emailVerified || false,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    };

    try {
      if (db) {
        await withTimeout(setDoc(doc(db, "users", firebaseUser.uid), userProfile), 3000);
      }
    } catch (dbErr) {
      console.warn("Firestore profile save timed out/failed:", dbErr.message);
    }

    // Immediately sign out to prevent auto-logging in upon registration
    await signOut(auth);
    setUser(null);

    return {
      success: true,
      message: "Account created successfully.",
    };
  }, [setUser]);

  // Login Flow - Supports Session Persistence & Firestore Role Fetching
  const login = useCallback(async (email, password, rememberMe = false) => {
    // Set persistence based on rememberMe checkbox
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    let userData = null;
    try {
      if (db) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        // Merge lastLogin timestamp
        await withTimeout(
          setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true }),
          3000
        );
        const userDoc = await withTimeout(getDoc(userDocRef), 3000);
        if (userDoc && userDoc.exists()) {
          userData = userDoc.data();
        }
      }
    } catch (updateErr) {
      console.warn("Could not update/fetch user in Firestore:", updateErr.message);
    }

    // Whitelist takes priority over whatever role is stored in Firestore
    const userRole = isAdminEmail(firebaseUser.email)
      ? "admin"
      : userData?.role || "user";

    // Sync role to Firestore if it differs
    if (db && userData && userData.role !== userRole) {
      withTimeout(
        setDoc(doc(db, "users", firebaseUser.uid), { role: userRole }, { merge: true }),
        3000
      ).catch(() => { });
    }

    // If no Firestore doc exists yet, create one on first login
    if (db && !userData) {
      withTimeout(
        setDoc(doc(db, "users", firebaseUser.uid), {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          phone: firebaseUser.phoneNumber || "",
          role: userRole,
          status: "active",
          photoURL: firebaseUser.photoURL || "",
          emailVerified: firebaseUser.emailVerified || false,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        }),
        3000
      ).catch(() => { });
    }

    const userObj = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: userData?.name || firebaseUser.displayName || "User",
      photoURL: firebaseUser.photoURL,
      phoneNumber: userData?.phone || firebaseUser.phoneNumber || "",
      status: userData?.status || "active",
      ...userData,
      role: userRole, // explicit last override
    };

    setUser(userObj);
    return { user: firebaseUser, role: userRole };
  }, [setUser]);

  // Google Login Flow
  const loginWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    let userDocExists = false;
    let userData = null;

    try {
      if (db) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await withTimeout(getDoc(userDocRef), 3000);
        if (userDoc && userDoc.exists()) {
          userDocExists = true;
          userData = userDoc.data();
        }
      }
    } catch (err) {
      console.warn("Firestore check failed in Google login:", err.message);
    }

    if (userDocExists && userData) {
      try {
        if (db) {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          await withTimeout(
            setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true }),
            3000
          );
        }
      } catch {
        // Ignore background sync error
      }

      const userRole = isAdminEmail(firebaseUser.email)
        ? "admin"
        : userData.role || "user";

      // Sync role to Firestore if it differs
      if (db && userData.role !== userRole) {
        withTimeout(
          setDoc(doc(db, "users", firebaseUser.uid), { role: userRole }, { merge: true }),
          3000
        ).catch(() => { });
      }

      const userObj = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: userData.name || firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        phoneNumber: userData.phone || firebaseUser.phoneNumber || "",
        ...userData,
        role: userRole,
      };

      setUser(userObj);
      return { user: firebaseUser, role: userRole };
    } else {
      const userProfile = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || "Google User",
        email: firebaseUser.email || "",
        phone: firebaseUser.phoneNumber || "",
        role: isAdminEmail(firebaseUser.email) ? "admin" : "user",
        status: "active",
        photoURL: firebaseUser.photoURL || "",
        emailVerified: firebaseUser.emailVerified || false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      };

      try {
        if (db) {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          await withTimeout(setDoc(userDocRef, userProfile), 3000);
        }
      } catch {
        // Ignore background sync error
      }

      const userObj = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        phoneNumber: firebaseUser.phoneNumber || "",
        ...userProfile,
      };

      setUser(userObj);
      return { user: firebaseUser, role: userProfile.role };
    }
  }, [setUser]);

  // Sign Out
  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, [setUser]);

  // Admin Actions: Fetch All Users
  const fetchAllUsers = useCallback(async () => {
    if (!db) return [];
    try {
      const usersCol = collection(db, "users");
      const snapshot = await withTimeout(getDocs(usersCol), 3000);
      return snapshot.docs.map((docSnap) => ({ uid: docSnap.id, ...docSnap.data() }));
    } catch (error) {
      console.warn("Error fetching all users from Firestore:", error.message);
      return [];
    }
  }, []);

  // Admin Actions: Subscribe to Users Real-time
  const subscribeToAllUsers = useCallback((onDataUpdate, onError) => {
    if (!db) return () => { };
    try {
      const usersCol = collection(db, "users");
      const unsubscribe = onSnapshot(
        usersCol,
        (snapshot) => {
          const usersList = snapshot.docs.map((docSnap) => ({
            uid: docSnap.id,
            ...docSnap.data(),
          }));
          onDataUpdate(usersList);
        },
        (err) => {
          console.warn("Firestore snapshot error in subscribeToAllUsers:", err.message);
          if (onError) onError(err);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("Failed to establish real-time subscription:", err.message);
      if (onError) onError(err);
      return () => { };
    }
  }, []);

  // Admin Actions: Update User Role
  const updateUserRole = useCallback(async (uid, newRole) => {
    const nowIso = new Date().toISOString();
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: nowIso,
    });
  }, []);

  // Admin Actions: Toggle Status (active/disabled)
  const toggleUserStatus = useCallback(async (uid, currentStatus) => {
    const nextStatus = currentStatus === "disabled" ? "active" : "disabled";
    const nowIso = new Date().toISOString();
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      status: nextStatus,
      updatedAt: nowIso,
    });
  }, []);

  // Admin Actions: Delete User Record
  const deleteUserRecord = useCallback(async (uid) => {
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
  }, []);

  // Admin Actions: Edit User Profile Data
  const updateUserProfileData = useCallback(async (uid, updatedFields) => {
    const nowIso = new Date().toISOString();
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...updatedFields,
      updatedAt: nowIso,
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signup,
      login,
      loginWithGoogle,
      logout,
      fetchAllUsers,
      subscribeToAllUsers,
      updateUserRole,
      toggleUserStatus,
      deleteUserRecord,
      updateUserProfileData,
    }),
    [
      user,
      loading,
      signup,
      login,
      loginWithGoogle,
      logout,
      fetchAllUsers,
      subscribeToAllUsers,
      updateUserRole,
      toggleUserStatus,
      deleteUserRecord,
      updateUserProfileData,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

