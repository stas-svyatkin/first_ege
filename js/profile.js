import { app, db } from "./firebase.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const auth = getAuth(app);


// элементы страницы

const groupRating =
    document.getElementById("groupRating");


const allRating =
    document.getElementById("allRating");


const teacherMessage =
    document.getElementById("teacherMessage");


let currentUserId = null;



onAuthStateChanged(auth, async (user) => {


    if (!user) {

        window.location.href = "index.html";

        return;
    }


    // сохраняем UID вошедшего пользователя

    currentUserId = user.uid;



    try {


        const userSnapshot =
            await getDoc(
                doc(db, "users", user.uid)
            );



        if (!userSnapshot.exists()) {


            alert("Данные пользователя не найдены");

            window.location.href = "index.html";

            return;

        }



        const userData =
            userSnapshot.data();



        const group =
            userData.group || "Без группы";



        const message =
            userData.teacher_message ||
            "Сообщений пока нет";



        teacherMessage.textContent =
            message;


        grouper.textContent =
            `Ваша группа: ${group}`;


        // загружаем рейтинги

        await loadGroupRating(group);

        await loadAllRating();



    } catch(error) {


        console.error(error);

        alert("Ошибка загрузки профиля");


    }



});





// ==========================
// Рейтинг группы
// ==========================


async function loadGroupRating(group) {


    const usersRef =
        collection(db,"users");



    const q =
        query(
            usersRef,
            where("group","==",group)
        );



    const snapshot =
        await getDocs(q);



    let users = [];



    snapshot.forEach((doc)=>{


        users.push({

            id: doc.id,

            ...doc.data()

        });


    });



    users.sort((a,b)=>{


        return (b.points || 0)
        -
        (a.points || 0);


    });



    groupRating.innerHTML = "";



    users.forEach((user)=>{


        const li =
            document.createElement("li");



        let text =
            `${user.login || "Без логина"} — ${user.points || 0} ⭐`;



        // если это мы

        if(user.id === currentUserId){


            text =
            "👤 " + text;


            li.classList.add("my-rating");


        }



        li.textContent = text;



        groupRating.appendChild(li);



    });


}







// ==========================
// Общий рейтинг
// ==========================


async function loadAllRating(){



    const usersRef =
        collection(db,"users");



    const snapshot =
        await getDocs(usersRef);



    let users = [];



    snapshot.forEach((doc)=>{


        users.push({

            id: doc.id,

            ...doc.data()

        });



    });



    users.sort((a,b)=>{


        return (b.points || 0)
        -
        (a.points || 0);


    });



    allRating.innerHTML = "";



    users.forEach((user)=>{


        const li =
            document.createElement("li");



        let text =
        `${user.login || "Без логина"} — ${user.points || 0} ⭐`;



        if(user.id === currentUserId){


            text =
            "👤 " + text;


            li.classList.add("my-rating");


        }



        li.textContent = text;



        allRating.appendChild(li);



    });



}