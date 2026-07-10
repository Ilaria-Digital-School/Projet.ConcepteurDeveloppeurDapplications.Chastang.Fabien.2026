// let month = Number(prompt("Veuillez saisir un nombre entier compris entre 1 et 12 :"));

// switch (month) {
//     case 1:
//         alert("Mois de Janvier, 31 jours");
//         break;
//     case 2:
//         alert("Mois de Février, 28 jours");
//         break;
//     case 3:
//         alert("Mois de Mars, 31 jours");
//         break;
//     case 4:
//         alert("Mois de Avril, 30 jours");
//         break;
//     case 5:
//         alert("Mois de Mai, 31 jours");
//         break;
//     case 6:
//         alert("Mois de Juin, 30 jours");
//         break;
//     case 7:
//         alert("Mois de Juillet, 31 jours");
//         break;
//     case 8:
//         alert("Mois de Août, 31 jours");
//         break;
//     case 9:
//         alert("Mois de Septembre, 30 jours");
//         break;
//     case 10:
//         alert("Mois de Octobre, 31 jours");
//         break;
//     case 11:
//         alert("Mois de Novembre, 30 jours");
//         break;
//     case 12:
//         alert("Mois de Décembre, 31 jours");
//         break;
//     default:
//         alert("Nombre incorrect !");
// }

/////////////////////////////////////////////////////////////////////

// let integer = Number(prompt("Veuillez saisir un nombre entier compris entre 0 et 49 :"));

// if (integer >= 0 && integer <= 49) {
//     const INTEGER = BigInt(integer);
//     let factorial = 1n;

//     for (let i = 2n; i <= INTEGER; i++) factorial *= i;

//     alert(`La factorielle de ${integer} vaut : ${factorial}.`);
// } else
//     alert("Valeur invalide !");

/////////////////////////////////////////////////////////////////////

// for (let i = 1; i <= 30; i++) {
//     if (i % 3 == 0)
//         console.log((i % 5 == 0) ? "FizzBuzz" : "Fizz");
//     else if (i % 5 == 0)
//         console.log("Buzz");
//     else
//         console.log(i);
// }

/////////////////////////////////////////////////////////////////////

// const NOMBRE_SECRET = 4;
// let count = 0, numUser;

// do {
//     count++;
//     numUser = Number(prompt("Entrez un nombre entier compris entre 1 et 5 pour deviner le nombre secret :"));
// } while (numUser >= 1 && numUser <= 5 && numUser != NOMBRE_SECRET);

// if (numUser == NOMBRE_SECRET) alert(`Vous avez découvert le nombre secret ${NOMBRE_SECRET} en ${count} étape(s).`);

/////////////////////////////////////////////////////////////////////

// let numUser = Number(prompt("Entrez un nombre :"));
// let sum = 0;

// while (numUser > 0) {
//     sum += numUser;
//     numUser = Number(prompt("Entrez un nombre :"));
// }

// if (sum > 0)
//     alert(`La somme des nombres positifs entrés vaut ${sum}.`);
// else
//     alert("Pas de nombre positif !");

/////////////////////////////////////////////////////////////////////

// const USERS = [];

// USERS.push("Islem");
// USERS.push("Bakary");
// USERS.push("Gilbert");
// USERS.push("Sandra");
// USERS.push("Aurore");

// // ----------------------------------------------

// const addItem = (item, array) => array.push(item);

// addItem("Kevin", USERS);

// for (const USER of USERS) console.log(USER);

// // ----------------------------------------------

// const findItem = (item, array) => console.log((array.indexOf(item) > -1) ? "Utilisateur trouvé" : "Utilisateur non trouvé");

// findItem(prompt("Entrez un nom :"), USERS);
// findItem(prompt("Entrez un nom :"), USERS);

// for (const USER of USERS) if ((/a/i).test(USER)) console.log(USER);

// // ----------------------------------------------

// console.log((!USERS || !USERS.length) ? "Aucun utilisateur" : `Nombre d'utilisateur(s) : ${USERS.length}`);

// let users2;
// console.log((!users2 || !users2.length) ? "Aucun utilisateur" : `Nombre d'utilisateur(s) : ${users2.length}`);

/////////////////////////////////////////////////////////////////////
// TP - 6

// Exo 1 ----------------------------------------------

// const INDEX = document.getElementById("INDEX");
// INDEX.style.backgroundColor = "red";
// INDEX.style.border = "5px solid green";

// Exo 2 ----------------------------------------------

// First method: HTML collection with getElementsByClassName, 'forEach' does not apply

// const TITLES = document.getElementsByClassName("product-title");
// for (const TITLE of TITLES) {
//     TITLE.style.color = "red";
//     TITLE.textContent = TITLE.textContent.toUpperCase();
//     // Other ways
//     // TITLE.style.textTransform = "uppercase";          // Using CSS
//     // TITLE.innerHTML = TITLE.innerHTML.toUpperCase();  // Less secure and slower, but allows for HTML insertion
// }

// Second method
// BETTER APPROACH: using a list with 'querySelectorAll' allows the use of 'forEach'

// document.querySelectorAll(".product-title").forEach(title => {
//     title.style.color = "red";
//     title.textContent = title.textContent.toUpperCase();
// });

// With an attribute (e.g., data-product-title="1"), use: document.querySelectorAll('[data-product-title="1"]')

// Exo 3 ----------------------------------------------

// document.querySelectorAll("button").forEach(btn => {
//     btn.style.background = "red";
//     btn.textContent = "Ajouter au panier";
// });

// Exo 4 ----------------------------------------------

// Old method, in the HTML: <button type="button" id="BTN1" onclick="displayMsg(this)">Acheter</button>

// function displayMsg(elt) {
//     console.log(`Clic sur bouton ${elt.id} !`);
// }

// BETTER APPROACH

// In the CSS file
// .btn-hover {
//     background-color: red !important;
//     font-weight: bold !important;
// }
// .btn-leave {
//     background-color: darkblue !important;
//     font-weight: normal !important;
// }

// const BTN2 = document.querySelector("#BTN2");
// if (BTN2) {
//     BTN2.addEventListener("click", () => {
//         console.log(`Clic sur bouton ${BTN2.id} !`);
//     });

//     BTN2.addEventListener("mouseenter", () => {
//         if (BTN2.className.indexOf("btn-leave") > -1)
//             BTN2.classList.replace("btn-leave", "btn-hover");
//         else
//             BTN2.classList.add("btn-hover");
//     });
//     BTN2.addEventListener("mouseleave", () => {
//         if (BTN2.className.indexOf("btn-hover") > -1)
//             BTN2.classList.replace("btn-hover", "btn-leave");
//         else
//             BTN2.classList.add("btn-leave");
//     });

//     BTN2.addEventListener("click", () => {
//         BTN2.style.cssText = "background-color: red !important;"
//         BTN2.textContent = "Ajouter !"
//     });
// }

// Exo 5 ----------------------------------------------

// document.querySelectorAll("article p:last-of-type").forEach(elt => {
//     const PRICE = Number(elt.textContent.replace(/\D/g, "")); // Using a regular expression to remove all non-numeric characters
//     if (PRICE < 25)
//         elt.style.color = "green";
//     else if (PRICE <= 50)
//         elt.style.color = "orange";
//     else
//         elt.style.color = "red";
// });

// Exo 6 ----------------------------------------------

// In the CSS file
// .article-top,
// .article-good {
//     position: absolute;
//     top: 7px;
//     padding: 0 3px;
//     font-size: 11px;
//     font-weight: 800;
//     border-radius: 3px;
// }
// .article-top {
//     right: 7px;
//     background-color: yellow;
//     color: #b90000;
//     border: 1px solid #b90000;
// }
// .article-good {
//     left: 7px;
//     background-color: lightgreen;
//     color: #004000;
//     border: 1px solid #004000;
// }

// document.querySelectorAll("article").forEach(article => {
//     const PRICE = Number(article.querySelector("p:last-of-type").textContent.replace(/\D/g, ""));
//     if (PRICE < 25)
//         article.innerHTML += '<span class="article-good">Bonne<br>Affaire</span>';
//     else if (PRICE > 50)
//         article.innerHTML += '<span class="article-top">Top<br>Produit</span>';
// });

/////////////////////////////////////////////////////////////////////

