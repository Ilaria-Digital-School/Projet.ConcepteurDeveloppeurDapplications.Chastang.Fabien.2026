//////////////////////////////////////////////////////////////////////////
// Classes for the 'gender', 'interests', 'country', and 'role' fields

// Gender class: static object //////////////////
class Gender {
    static fieldName = "gender-user";
    static list = [
        { value: 1, id: "female", label: "Femme" },
        { value: 2, id: "male", label: "Homme" }
    ];
    static other = 0;

    // Return a valid gender
    static get = genderId => {
        if (genderId) {
            const GENDER_ID = parseInt(genderId);
            return (this.list.some(item => item.value == GENDER_ID)) ? GENDER_ID : this.other;
        } else
            return this.other;
    };

    // Fill in the 'gender' field
    static fill = () => {
        const GENDER = document.getElementById("gender-container");

        this.list.forEach(item => {
            const DIV = document.createElement("div");
            DIV.classList.add("field");
            DIV.innerHTML = `
                <input type="radio" name="${this.fieldName}" id="${item.id}" value="${item.value}">
                <label for="${item.id}"> ${item.label}&ensp;</label>
            `;
            GENDER.appendChild(DIV);
        });
    };
}

// Interests class: static object ///////////////
class Interests {
    static fieldName = "interests-user";
    static list = [
        { value: 1, id: "clothes", label: "Vêtements" },
        { value: 2, id: "accessories", label: "Accessoires" }
    ];
    static other = [];

    // Return a valid array of interests
    static get = interestIDs => {
        if (Array.isArray(interestIDs) && interestIDs.length > 0) {
            const INTEREST_IDS = interestIDs.map(item => parseInt(item));
            return this.list.filter(item => INTEREST_IDS.some(item2 => item2 == item.value));
        } else
            return this.other;
    };

    // Fill in the 'interests' field
    static fill = () => {
        const INTERESTS = document.getElementById("interests-container");

        this.list.forEach(item => {
            const DIV = document.createElement("div");
            DIV.classList.add("field");
            DIV.innerHTML = `
                <input type="checkbox" name="${this.fieldName}" id="${item.id}" value="${item.value}">
                <label for="${item.id}"> ${item.label}&ensp;</label>
            `;
            INTERESTS.appendChild(DIV);
        });
    };
}

// Country class: static object /////////////////
class Country {
    static list = [
        { value: 1, label: "Canada" },
        { value: 2, label: "Chine" },
        { value: 3, label: "Espagne" },
        { value: 4, label: "États-Unis" },
        { value: 5, label: "France" },
        { value: 6, label: "Italie" },
        { value: 7, label: "Japon" },
        { value: 8, label: "Royaume-Uni" },
        { value: 9, label: "Tunisie" }
    ];
    static other = { value: 0, label: "– Autre –" };

    // Return a valid country
    static get = countryId => {
        if (countryId) {
            const COUNTRY_ID = parseInt(countryId);
            return (this.list.some(item => item.value == COUNTRY_ID)) ? COUNTRY_ID : this.other.value;
        } else
            return this.other.value;
    };

    // Fill in the 'country' field
    static fill = countryId => {
        const COUNTRY = document.getElementById("country-user");
        const COUNTRY_ID = parseInt(countryId) || this.other.value;

        let selected = false;
        this.list.forEach(item => {
            const OPTION = new Option(item.label, item.value);
            if (item.value == COUNTRY_ID) {
                selected = true;
                OPTION.selected = true;
            }
            COUNTRY.add(OPTION);
        });

        const OTHER = new Option(this.other.label, this.other.value);
        if (!selected) OTHER.selected = true;
        COUNTRY.add(OTHER);
    };

    // Get the ID from the name and the name from the ID
    static getId = countryName => {
        const COUNTRY = this.list.find(item => item.label == countryName);
        return (COUNTRY) ? COUNTRY.value : this.other.value;
    };
    static getName = countryId => {
        const COUNTRY = this.list.find(item => item.value == countryId);
        return (COUNTRY) ? COUNTRY.label : this.other.label;
    };
}

// Role class: static object ////////////////////
class Role {
    static user = 0;
    static admin = 1;
    static superAdmin = 2;

    static validate = role => {
        const ROLE = parseInt(role);
        return (ROLE == Role.user || ROLE == Role.admin || ROLE == Role.superAdmin) ? ROLE : null;
    };
}

//////////////////////////////////////////////////////////////////////////
// Manage users

// Main class
class User {
    constructor(name, email, password, genderId, interestIDs, countryId, role = Role.user) {
        this.id = 0
        this.name = name;
        this.email = email;
        this.password = password;
        this.gender = genderId;
        this.interests = interestIDs;
        this.country = countryId;
        this.role = role;
    }

    updateProperty(property, value, toChange) {
        if (toChange) this[property] = value;
        return toChange;
    }

    update(name, email, password, genderId, interestIDs, countryId) {
        let isChanged = false;
        isChanged ||= this.updateProperty("name", name, name && this.name != name);
        isChanged ||= this.updateProperty("email", email, email && this.email != email);
        isChanged ||= this.updateProperty("password", password, password && this.password != password);
        if (genderId) {
            const GENDER_ID = Gender.get(genderId);
            isChanged ||= this.updateProperty("gender", GENDER_ID, this.gender != GENDER_ID);
        }
        if (interestIDs) {
            const INTEREST_IDS = Interests.get(interestIDs);
            isChanged ||= this.updateProperty("interests", INTEREST_IDS, JSON.stringify(this.interests) != JSON.stringify(INTEREST_IDS));
        }
        if (countryId) {
            const COUNTRY_ID = Country.get(countryId);
            isChanged ||= this.updateProperty("country", COUNTRY_ID, this.country != COUNTRY_ID);
        }
        return isChanged;
    }

    updateRole(role) {
        const ROLE = Role.validate(role);
        if (ROLE === null) return null;

        if (this.role != ROLE) {
            this.role = ROLE;
            return true;
        }
        return false;
    }
}

//////////////////////////////////////////////////////////////////////////
// Add, update and remove a user

// UTILITIES: functions to validate the 'name', 'email', and 'password' parameters
function checkName(name) {
    const NAME = (name) ? name.toString().trim() : "";
    return (NAME.replace(/\s/g, "").length >= 3) ? NAME.replace(/\s{2,}/g, " ") : null;
}
function checkEmail(email) {
    const EMAIL = (email) ? email.toString().trim() : "";
    return (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(EMAIL)) ? EMAIL : null;
}
function checkPassword(password) {
    const PASSWORD = (password) ? password.toString() : "";
    return (PASSWORD.length >= 8 && !/\s/.test(PASSWORD)) ? PASSWORD : null;
}
// UTILITIES: error message display
function displayLog(msg, toConsole = true) {
    ((toConsole) ? console.log : alert)(msg);
    return false;
}
// UTILITIES: global function for parameter validation and user retrieval by ID if necessary
function checkParams(isAdded, name, email, password, pswdConfirm, toConsole, prefixMsg = "", userId = 0) {
    // Check the parameters
    const ID = parseInt(userId);
    if (!isAdded && !ID) return displayLog(prefixMsg + "L'identifiant est incorrect !", toConsole);

    const NAME = checkName(name);
    if (isAdded && !NAME) return displayLog(prefixMsg + "Le nom doit contenir au moins trois caractères non blancs !", toConsole);

    const EMAIL = checkEmail(email);
    if (isAdded && !EMAIL) return displayLog(prefixMsg + "L'e-mail est invalide !", toConsole);

    const PASSWORD = checkPassword(password);
    if (isAdded && !PASSWORD) return displayLog(prefixMsg + "Le mot de passe doit contenir au moins 8 caractères et aucun caractère blanc !", toConsole);

    if ((isAdded || PASSWORD) && PASSWORD != pswdConfirm)
        return displayLog(prefixMsg + "La confirmation du mot de passe est incorrecte !", toConsole);

    // Retrieve the users from local storage and verify that the email is not already registered
    const USERS = lsGetItems("users");

    if (!isAdded) {
        if (USERS.length == 0)
            return displayLog(prefixMsg + "Mise à jour impossible : aucun utilisateur n'est enregistré !", toConsole);

        const USER = USERS.find(user => user.id == ID);
        if (!USER) return displayLog(prefixMsg + "L'identifiant est incorrect !", toConsole);

        if (EMAIL && USER.email != EMAIL && USERS.some(user => user.email == EMAIL))
            return displayLog(prefixMsg + "Cet e-mail existe déjà !", toConsole);

    } else if (USERS.some(user => user.email == EMAIL))
        return displayLog(prefixMsg + "Cet e-mail existe déjà !", toConsole);

    return (isAdded) ? [NAME, EMAIL, PASSWORD, USERS] : [NAME, EMAIL, PASSWORD, USERS, USER];
}

// Add a new user to local storage
function addUser(countryId = 0, toConsole = false) {
    const PREFIX_MSG = (toConsole) ? "[add user] - " : "";

    // Get the parameters
    const PARAMS = checkParams(
        true,
        document.getElementById("name-user").value,
        document.getElementById("email-user").value,
        document.getElementById("password-user").value,
        document.getElementById("password-confirm").value,
        toConsole,
        PREFIX_MSG
    );
    if (!PARAMS) return false;

    const [NAME, EMAIL, PASSWORD, USERS] = PARAMS;

    // Updating formatted fields
    document.getElementById("name-user").value = NAME;
    document.getElementById("email-user").value = EMAIL;

    let objGender = document.querySelector('input[name="gender-user"]:checked');
    const GENDER_ID = (objGender) ? Gender.get(objGender.value) : Gender.other;
    let objInterests = document.querySelectorAll('input[name="interests-user"]:checked');
    const INTEREST_IDS = (objInterests) ? Interests.get(Array.from(objInterests).map(item => item.value)) : Interests.other;
    let objCountry = document.getElementById("country-user");
    const COUNTRY_ID = Country.get(objCountry.options[objCountry.selectedIndex].value);

    // Create a new user and save it to local storage
    const USER = new User(NAME, EMAIL, PASSWORD, GENDER_ID, INTEREST_IDS, COUNTRY_ID);
    USERS.lsAddItem("users", USER);

    // Reset the form and display the validation message
    document.getElementById("form-user").reset();
    if (countryId) objCountry.select(countryId);
    displayLog(PREFIX_MSG + "Votre profile est créé.", toConsole);

    return true;
}

// Update a user (except their role) in local storage
function updateUser(userId, name, email, password, pswdConfirm, genderId, interestIDs, countryId, toConsole = false) {
    let prefixMsg = (toConsole) ? "[update user] - " : "";

    // Get the parameters
    const PARAMS = checkParams(
        false,
        name,
        email,
        password,
        pswdConfirm,
        toConsole,
        prefixMsg,
        userId
    );
    if (!PARAMS) return false;

    const [NAME, EMAIL, PASSWORD, USERS, USER] = PARAMS;
    prefixMsg = (toConsole) ? `[update ${(USER.role != Role.superAdmin) ? (USER.role != Role.admin) ? "user" : "admin" : "super-admin"}] - ` : "";

    // Perform the update
    const IS_CHANGED = USER.update(NAME, EMAIL, PASSWORD, genderId, interestIDs, countryId);

    if (IS_CHANGED) {
        // Save the changes to local storage and display the confirmation message
        localStorage.setItem("users", JSON.stringify(USERS));
        displayLog(prefixMsg + "Votre profile a été mis à jour.", toConsole);
    } else
        // No changes have been done
        displayLog(prefixMsg + "Aucune modification n'a été apportée à votre profile !", toConsole);

    return true;
}

// Remove a user from local storage
function removeUser(userId, toConsole = true) {
    lsGetItems("users").lsRemoveItem("users", userId);
    displayLog(((toConsole) ? "[remove user] - " : "") + "Votre profile a été supprimé.", toConsole);
}

//////////////////////////////////////////////////////////////////////////
// Manage user login/logout

function login(toConsole = false) {
    // Retrieve the users from local storage and verify that the email/password are registered
    const USERS = lsGetItems("users");
    const EMAIL = document.getElementById("email-user").value.trim();
    const PASSWORD = document.getElementById("password-user").value;

    const USER = USERS.find(user => user.email == EMAIL && user.password == PASSWORD);
    if (USER) {
        // Save the user ID to session storage and redirect the page
        loginUser(USER.id, document.querySelector('input[id="permanent-login"]:checked'));
        window.location.href = "../index.html";
    } else {
        // Invalid login: display the error message and redirect the page
        displayLog(((toConsole) ? "[login] - " : "") + "E-mail ou mot de passe incorrect !", toConsole);
        window.location.href = "addUser.html";
    }
}

function logout(toConsole = false) {
    logoutUser();
    displayLog(((toConsole) ? "[logout] - " : "") + "Vous êtes déconnecté.", toConsole);
}

//////////////////////////////////////////////////////////////////////////
// BACKEND (normally): manage administrators

// Add a new admin to local storage
function addAdmin(name, email, password, pswdConfirm, genderId, countryId, isSuper = false, toConsole = true) {
    const PREFIX_MSG = (toConsole) ? `[add ${(isSuper) ? "super-admin" : "admin"}] - ` : "";

    // Get the parameters
    const PARAMS = checkParams(
        true,
        name,
        email,
        password,
        pswdConfirm,
        toConsole,
        PREFIX_MSG
    );
    if (!PARAMS) return false;

    const [NAME, EMAIL, PASSWORD, USERS] = PARAMS;
    const GENDER_ID = Gender.get(genderId);
    const COUNTRY_ID = Country.get(countryId);

    // Create a new admin and save it to local storage
    const ADMIN = new User(NAME, EMAIL, PASSWORD, GENDER_ID, [], COUNTRY_ID, (isSuper) ? Role.superAdmin : Role.admin);
    USERS.lsAddItem("users", ADMIN);

    // Display the validation message
    displayLog(PREFIX_MSG + "Le profile est créé.", toConsole);

    return true;
}

// Update a user's role in local storage
function updateRole(userId, role, toConsole = true) {
    const PREFIX_MSG = (toConsole) ? "[update user's role] - " : "";

    // Retrieve the user ID
    const ID = parseInt(userId);
    if (!ID) return displayLog(PREFIX_MSG + "L'identifiant est incorrect !", toConsole);

    // Retrieve the list of users
    const USERS = lsGetItems("users");
    if (USERS.length == 0)
        return displayLog(PREFIX_MSG + "Mise à jour impossible : aucun utilisateur n'est enregistré !", toConsole);

    // Retrieve the user by ID
    const USER = USERS.find(user => user.id == ID);
    if (!USER) return displayLog(PREFIX_MSG + "L'identifiant est incorrect !", toConsole);

    // Retrieve the user's role
    const IS_CHANGED = USER.updateRole(role);
    if (IS_CHANGED === null) return displayLog(PREFIX_MSG + "Le rôle de l'utilisateur est incorrect !", toConsole);

    if (IS_CHANGED) {
        // Save the change made to the user's role in local storage and display a confirmation message
        localStorage.setItem("users", JSON.stringify(USERS));
        displayLog(PREFIX_MSG + "Le rôle de l'utilisateur a été mis à jour.", toConsole);
    } else
        // No changes have been done
        displayLog(PREFIX_MSG + "Aucune modification n'a été apporté au rôle de l'utilisateur !", toConsole);

    return true;
}