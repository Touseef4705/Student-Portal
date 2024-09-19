// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAVOCY5c-WPbYU1MhnguawWhwwS2yVYalk",
    authDomain: "login-signup-form-74ce4.firebaseapp.com",
    projectId: "login-signup-form-74ce4",
    storageBucket: "login-signup-form-74ce4.appspot.com",
    messagingSenderId: "1002877735344",
    appId: "1:1002877735344:web:afa9590156f32eaf4c4675",
    measurementId: "G-PT7YN7CVD7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Sign in with email and password
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            
            // Get the user role from Firestore
            const userDocRef = doc(db, "users", user.uid);
            getDoc(userDocRef).then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    var userData = docSnapshot.data();
                    var userRole = userData.role;
                    
                    // Redirect based on role
                    if (userRole === "admin") {
                        window.location.href = "/admin-dashboard.html";
                    } else if (userRole === "student") {
                        window.location.href = "/student-dashboard.html";
                    } else {
                        console.log("Unknown role: " + userRole);
                    }
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        })
        .catch((error) => {
            console.log("Error signing in:", error.message);
        });
});
