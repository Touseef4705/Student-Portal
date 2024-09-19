// Import and configure Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js';
import { getFirestore, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-firestore.js';

// Your Firebase configuration
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

document.getElementById('editProfileForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const cnic = document.getElementById('cnic').value;
    const user = auth.currentUser;

    if (user) {
        // Update user profile in Firestore
        updateDoc(doc(db, 'users', user.uid), {
            firstName: firstName,
            lastName: lastName,
            cnic: cnic
        })
        .then(() => {
            console.log('Profile updated successfully');
            alert('Profile updated successfully!');
        })
        .catch((error) => {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        });
    } else {
        console.log('No user is currently signed in.');
        alert('Please sign in to update your profile.');
    }
});
