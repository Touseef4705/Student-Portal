import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAVOCY5c-WPbYU1MhnguawWhwwS2yVYalk",
    authDomain: "login-signup-form-74ce4.firebaseapp.com",
    projectId: "login-signup-form-74ce4",
    storageBucket: "login-signup-form-74ce4.appspot.com",
    messagingSenderId: "1002877735344",
    appId: "1:1002877735344:web:0c800b18f1de96b54c4675",
    measurementId: "G-W9SR7RTBEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Validate CNIC input
// function isValidCNIC(cnic) {
//     const cnicPattern = /^[0-9]{13}$/;  // 13-digit CNIC
//     return cnicPattern.test(cnic);
// }

document.getElementById('resultForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const cnic = document.getElementById('cnic').value;

    // Input validation
    // if (!isValidCNIC(cnic)) {
    //     alert("Please enter a valid CNIC (13 digits).");
    //     return;
    // }

    // Display loading message
    document.getElementById('result').innerHTML = `<p>Loading results...</p>`;

    try {
        // Check if user is authenticated
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("Authenticated user ID:", user.uid);

                console.log("Searching for student with CNIC:", cnic);
                const studentQuery = query(collection(db, 'users'), where('cnic', '==', cnic));
                const querySnapshot = await getDocs(studentQuery);

                if (querySnapshot.empty) {
                    document.getElementById('result').innerHTML = `<p>No student found with the provided CNIC.</p>`;
                    return; // Exit if no student found
                }

                let result = '';

                // Loop through each student found
                for (const doc of querySnapshot.docs) {
                    console.log("Found student:", doc.id); // Debugging log for student

                    const marksQuery = query(collection(db, 'marks'), where('studentId', '==', doc.id));
                    const marksSnapshot = await getDocs(marksQuery);

                    if (marksSnapshot.empty) {
                        result += `<p>No marks found for this student.</p>`;
                    } else {
                        marksSnapshot.forEach((markDoc) => {
                            const data = markDoc.data();
                            result += `
                            <div class="bg-white w-50 p-6 mb-6 rounded-lg shadow-lg border border-gray-200">
                                <p class="text-xl font-bold text-indigo-700 mb-2">Course: 
                                    <span class="font-medium text-gray-800">${data.course}</span>
                                </p>
                                <p class="text-lg font-semibold text-gray-700">Marks: 
                                    <span class="font-normal text-gray-600">${data.marks}</span>
                                </p>
                                <p class="text-lg font-semibold text-gray-700">Total Marks: 
                                    <span class="font-normal text-gray-600">${data.totalMarks}</span>
                                </p>
                                <p class="text-lg font-semibold text-gray-700">Grade: 
                                    <span class="font-normal text-gray-600">${data.grade}</span>
                                </p>
                            </div>`;
                        });
                    }
                }

                document.getElementById('result').innerHTML = result; // Display result
            } else {
                // User is not signed in, prompt them to sign in
                alert("You need to be signed in to view the results.");
                document.getElementById('result').innerHTML = `<p>Please sign in to continue.</p>`;
            }
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById('result').innerHTML = `<p>Failed to fetch results: ${error.message}</p>`;
    }
});
