// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

const studentIdDisplay = document.getElementById('studentIdDisplay');

// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user.uid);
        studentIdDisplay.innerText = user.uid;
    } else {
        window.location.href = "/login.html";  // Redirect to login if not logged in
    }
});

// Function to add a student to Firebase Authentication and Firestore
document.getElementById('addStudentForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const cnic = document.getElementById('cnic').value;

    // Validate inputs
    if (!firstName || !lastName || !email || !password || !cnic) {
        alert("All fields must be filled out.");
        return;
    }

    try {
        // Create a new student in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const studentUser = userCredential.user;

        // Add student data to Firestore under 'users' collection
        await setDoc(doc(db, "users", studentUser.uid), {
            firstName: firstName,
            lastName: lastName,
            email: email,
            studentId: studentUser.uid, 
            password: password,
            cnic: cnic,
            role: "student",
            createdAt: new Date()
        });

        alert("Student added successfully!");
        document.getElementById('addStudentForm').reset();  // Reset form after submission
    } catch (error) {
        console.error("Error adding student:", error);
        alert("Failed to add student: " + error.message);
    }
});

// Function to upload marks for a student
document.getElementById('uploadMarksForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Retrieve input values
    const studentIdInput = document.getElementById('studentId');
    const courseInput = document.getElementById('course');
    const marksInput = document.getElementById('marks');
    const totalMarksInput = document.getElementById('totalMarks');

    // Validate inputs
    const studentId = studentIdInput.value;
    const course = courseInput.value;
    const marksNum = parseFloat(marksInput.value);
    const totalMarksNum = parseFloat(totalMarksInput.value);

    if (isNaN(marksNum) || isNaN(totalMarksNum) || marksNum < 0 || totalMarksNum <= 0 || !studentId || !course) {
        alert("Please enter valid numbers for marks and total marks, and ensure all fields are filled.");
        return;
    }

    // Calculate percentage
    const percentage = (marksNum / totalMarksNum) * 100;

    // Define a simple grading system
    let grade;
    if (percentage >= 90) {
        grade = 'A';
    } else if (percentage >= 80) {
        grade = 'B';
    } else if (percentage >= 70) {
        grade = 'C';
    } else if (percentage >= 60) {
        grade = 'D';
    } else {
        grade = 'F';
    }

    try {
        // Get reference to the student document
        const studentDocRef = doc(db, "users", studentId);
        
        // Check if the student document exists
        const studentDocSnapshot = await getDoc(studentDocRef);
        if (!studentDocSnapshot.exists()) {
            console.log("Document does not exist for studentId:", studentId);
            throw new Error("No student found with the provided ID");
        }

        // Add or update marks in the 'marks' collection with grade
        await setDoc(doc(db, "marks", `${studentId}_${course}`), {
            studentId: studentId,
            course: course,
            marks: marksNum,
            totalMarks: totalMarksNum,
            grade: grade,
            createdAt: new Date()
        });

        alert("Marks and grade uploaded successfully!");
        document.getElementById('uploadMarksForm').reset(); // Reset form after submission
    } catch (error) {
        console.error("Error uploading marks:", error);
        alert("Failed to upload marks: " + error.message);
    }
});

// Function to sign out the admin
document.getElementById('signoutButton').addEventListener('click', function () {
    signOut(auth).then(() => {
        alert("Signed out successfully!");
        window.location.href = "../index.html";  // Redirect to login page after sign out
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
});
