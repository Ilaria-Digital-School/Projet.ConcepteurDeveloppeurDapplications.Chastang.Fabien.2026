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

