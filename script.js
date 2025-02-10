// ✅ استيراد مكتبات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// ✅ تهيئة Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBU8BZv5KqXohDFkMTFccJFzakxxrWyBHQ",
    authDomain: "social-media-sites-d1580.firebaseapp.com",
    projectId: "social-media-sites-d1580",
    storageBucket: "social-media-sites-d1580.appspot.com",
    messagingSenderId: "474209346545",
    appId: "1:474209346545:web:02517e53a2b259a0981a50"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ✅ تغيير ألوان الخلفية بشكل دوري
function changeRainbowColors() {
    const colors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#8b00ff"];
    let index = 0;
    setInterval(() => {
        document.body.style.background = colors[index];
        index = (index + 1) % colors.length;
    }, 3000);
}

// ✅ تسجيل الدخول باستخدام Google
window.loginWithGoogle = function () {
    signInWithPopup(auth, provider)
        .then(result => {
            document.getElementById("loginScreen").style.display = "none";
            checkUserName(result.user);
        })
        .catch(error => console.error("خطأ في تسجيل الدخول:", error));
};

// ✅ تسجيل الدخول بالبريد وكلمة السر
window.loginWithEmail = function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
        .then(result => {
            document.getElementById("loginScreen").style.display = "none";
            checkUserName(result.user);
        })
        .catch(error => alert("خطأ في تسجيل الدخول: " + error.message));
};

// ✅ إرسال رسالة
window.sendMessage = async function () {
    const messageText = document.getElementById("newMessage").value;
    if (!messageText) return alert("⚠️ الرجاء إدخال نص الرسالة!");

    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const userName = userSnap.exists() ? userSnap.data().name : user.email.split('@')[0];

    await addDoc(collection(db, "messages"), {
        text: messageText,
        timestamp: serverTimestamp(),
        user: userName
    });

    document.getElementById("newMessage").value = "";
    loadMessages();
};

// ✅ تحميل المحادثات عند فتح الصفحة
window.onload = function () {
    changeRainbowColors();
};

// ✅ تسجيل الخروج
window.logout = function () {
    signOut(auth).then(() => {
        document.getElementById("loginScreen").style.display = "flex";
    }).catch(error => console.error("خطأ في تسجيل الخروج:", error));
};