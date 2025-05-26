import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";
import {
  getFirestore,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoBWszdfhGbTqsnET9BNvwEs0wlbPrI3w",
  authDomain: "govt-docs-26936.firebaseapp.com",
  projectId: "govt-docs-26936",
  storageBucket: "govt-docs-26936.appspot.com",
  messagingSenderId: "493906250428",
  appId: "1:493906250428:web:5c725aa5749abb8cd4deb9",
  measurementId: "G-5Q4D1VQ9TD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

// Register User
export function registerUser() {
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      alert("Registered successfully!");
      console.log("User:", userCredential.user);
    })
    .catch(error => {
      console.error(error.message);
      alert("Error: " + error.message);
    });
}

// Login User
export async function loginUser() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    console.log("Logged in:", userCredential.user);

    // Fetch user profile
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      document.getElementById("profileName").innerText = userData.fullName || "Name not found";
    } else {
      console.log("No user profile found.");
    }
  } catch (error) {
    console.error(error.message);
    alert("Login failed: " + error.message);
  }
}

// Upload File
export async function uploadDocument() {
  const fileInput = document.getElementById('docFile');
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file first.");
    return;
  }

  try {
    const storageRef = ref(storage, 'documents/' + file.name);
    await uploadBytes(storageRef, file);
    alert("File uploaded successfully!");
  } catch (error) {
    console.error("Upload failed:", error.message);
    alert("Upload failed: " + error.message);
  }
}
