import { app, db } from "./firebase.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    doc,
    setDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const auth = getAuth(app);
const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const login = document.getElementById("login").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const passwordRepeat = document.getElementById("passwordRepeat").value;

    if (email === "") {
        alert("Введите почту");
        return;
    }
    if (login === "") {
        alert("Введите логин");
        return;
    }
    if (login.length < 6) {
        alert("Логин должен содержать минимум 6 символа");
        return;
    }
    if (login.length > 20) {
        alert("Логин должен содержать максимум 20 символов");
        return;
    }
    if (password === "") {
        alert("Введите пароль");
        return;
    }
    if (password.length < 6) {
        alert("Пароль должен содержать минимум 6 символов");
        return;
    }
    if (password !== passwordRepeat) {
        alert("Пароли не совпадают");
        return;
    }

    try {
        const usersRef = collection(db, "users");
        const loginQuery = query(usersRef, where("login", "==", login));
        const loginSnapshot = await getDocs(loginQuery);

        if (!loginSnapshot.empty) {
            alert("Такой логин уже занят");
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            login: login,
            email: email,
            points: 0,
            group: "",
            teacher_message: "",
            createdAt: Date.now()
        });

        alert("Регистрация успешна!");
        window.location.href = "profile.html";
    } catch (error) {
        console.error(error);
        switch (error.code) {
            case "auth/email-already-in-use":
                alert("Такая почта уже зарегистрирована");
                break;
            case "auth/invalid-email":
                alert("Введите корректную почту");
                break;
            case "auth/weak-password":
                alert("Пароль должен содержать минимум 6 символов");
                break;
            case "auth/network-request-failed":
                alert("Ошибка сети. Проверьте интернет");
                break;
            case "permission-denied":
                alert("Firebase запретил доступ к базе данных");
                break;
            default:
                alert("Ошибка регистрации: " + error.message);
        }
    }
});
