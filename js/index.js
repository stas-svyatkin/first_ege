import { app, db } from "./firebase.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const auth = getAuth(app);
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
    const login = document.getElementById("login").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    if (login === "") {
        alert("Введите логин");
        return;
    }

    if (password === "") {
        alert("Введите пароль");
        return;
    }

    try {
        const usersRef = collection(db, "users");
        const loginQuery = query(usersRef, where("login", "==", login));
        const snapshot = await getDocs(loginQuery);

        if (snapshot.empty) {
            alert("Неверный логин или пароль");
            return;
        }

        const userData = snapshot.docs[0].data();
        const email = userData.email;

        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "profile.html";
    } catch (error) {
        console.error(error);

        switch (error.code) {
            case "auth/invalid-credential":
            case "auth/user-not-found":
            case "auth/wrong-password":
                alert("Неверный логин или пароль");
                break;
            case "auth/user-disabled":
                alert("Аккаунт заблокирован");
                break;
            case "auth/too-many-requests":
                alert("Слишком много попыток входа. Попробуйте позже");
                break;
            case "auth/network-request-failed":
                alert("Ошибка сети. Проверьте подключение к интернету");
                break;
            case "permission-denied":
                alert("Firebase запретил доступ к базе данных");
                break;
            default:
                alert("Ошибка входа: " + error.message);
        }
    }
});
