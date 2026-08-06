import { app, db } from "./firebase.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const auth = getAuth(app);

const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", async () => {

    const login = document.getElementById("login").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (login === "") {
        alert("Введите логин");
        return;
    }
    else if (email === "") {
        alert("Введите email");
        return;
    }
    else if (password === "") {
        alert("Введите пароль");
        return;
    }


    try {

        // Создаём пользователя в Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        console.log("Login:", login);
        console.log("Email:", email);
        console.log("Password:", password);

        const user = userCredential.user;

        // Сохраняем информацию в Firestore
        await setDoc(doc(db, "users", user.uid), {
            login: login,
            email: email,
            points: 0,
            group: "",
            createdAt: Date.now()
        });

        alert("Регистрация успешна!");

        window.location.href = "profile.html";

    } catch (error) {
    

    if (error.code === "auth/weak-password" ||
        error.code === "auth/missing-password"
    ) {
        alert("Пароль должен содержать минимум 6 символов");
    }
    else if (error.code === "auth/invalid-email" 
    ) {
        alert("Несуществующая почта ");
    }

    else {
        alert(error.message);
    }


}

});