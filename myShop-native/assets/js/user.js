//////////////////////////////////////////////////////////////////////////
// Classes for the 'gender', 'interests' and 'country' fields
//////////////////////////////////////////////////////////////////////////


// Gender class: static object ///////////////////////////////////////////
class Gender {
    static fieldId = "gender-container";
    static fieldName = "gender-user";

    static other = { value: 0, id: "other", label: "Je le garde pour moi" };
    static list = [
        { value: 1, id: "female", label: "Femme" },
        { value: 2, id: "male", label: "Homme" },
        this.other
    ];

    // Return a valid gender
    static get = genderId => {
        if (genderId) {
            const GENDER_ID = parseInt(genderId);
            return (this.list.some(item => item.value == GENDER_ID)) ? GENDER_ID : this.other.value;
        } else
            return this.other.value;
    };

    // Get the ID from the name and the name from the ID
    static getId = genderName => {
        const NAME = genderName.trim().toLowerCase();
        const GENDER = this.list.find(item => item.label.toLowerCase() == NAME);
        return (GENDER) ? GENDER.value : this.other.value;
    };
    static getName = genderId => {
        const GENDER = this.list.find(item => item.value == genderId);
        return (GENDER) ? GENDER.label : undefined;
    };

    // Initialize the field
    static init = genderId => {
        const GENDER_ID = parseInt(genderId) || this.other.value;
        this.list.forEach(item => document.getElementById(item.id).checked = item.value == GENDER_ID);
    };

    // Fill the 'gender' field
    static fill = genderId => {
        const GENDER = document.getElementById(this.fieldId);
        const GENDER_ID = parseInt(genderId) || this.other.value;

        this.list.forEach(item => {
            const DIV = document.createElement("div");
            DIV.classList.add("field");
            DIV.innerHTML = `
                <input type="radio" name="${this.fieldName}" id="${item.id}" value="${item.value}"
                    ${(item.value == GENDER_ID) ? "checked" : ""}>
                <label for="${item.id}"> ${item.label}&ensp;</label>
            `;
            GENDER.appendChild(DIV);
        });
    };
}

// Interests class: static object ////////////////////////////////////////
class Interests {
    static fieldId = "interests-container";
    static fieldName = "interests-user";

    static other = [];
    static list = [
        { value: 1, id: "clothes", label: "Vêtements" },
        { value: 2, id: "accessories", label: "Accessoires" }
    ];

    // Return a valid array of interests
    static get = interestIDs => {
        if (Array.isArray(interestIDs) && interestIDs.length > 0) {
            const INTEREST_IDS = interestIDs.map(item => parseInt(item));
            return this.list.filter(item => INTEREST_IDS.some(param => param == item.value));
        } else
            return this.other;
    };

    // Get the ID from the name and the name from the ID
    static getId = interestName => {
        const NAME = interestName.trim().toLowerCase();
        const INTEREST = this.list.find(item => item.label.toLowerCase() == NAME);
        return (INTEREST) ? INTEREST.value : 0;
    };
    static getName = interestId => {
        const INTEREST = this.list.find(item => item.value == interestId);
        return (INTEREST) ? INTEREST.label : undefined;
    };

    // Initialize the field
    static init = interestIDs => {
        const INTEREST_IDS = (Array.isArray(interestIDs)) ? interestIDs : this.other;
        this.list.forEach(item => document.getElementById(item.id).checked = INTEREST_IDS.some(param => item.value == param));
    };

    // Fill the 'interests' field
    static fill = interestIDs => {
        const INTERESTS = document.getElementById(this.fieldId);
        const INTEREST_IDS = (Array.isArray(interestIDs)) ? interestIDs : this.other;

        this.list.forEach(item => {
            const DIV = document.createElement("div");
            DIV.classList.add("field");
            DIV.innerHTML = `
                <input type="checkbox" name="${this.fieldName}" id="${item.id}" value="${item.value}"
                    ${(INTEREST_IDS.some(interest => interest == item.value)) ? "checked" : ""}>
                <label for="${item.id}"> ${item.label}&ensp;</label>
            `;
            INTERESTS.appendChild(DIV);
        });
    };
}

// Country class: static object //////////////////////////////////////////
class Country {
    static fieldId = "country-user";

    static other = { value: 0, label: "– Autre –" };
    static list = [
        { value: 1, label: "Allemagne" },
        { value: 2, label: "Autriche" },
        { value: 3, label: "Belgique" },
        { value: 4, label: "Brésil" },
        { value: 5, label: "Canada" },
        { value: 6, label: "Chine" },
        { value: 7, label: "Espagne" },
        { value: 8, label: "États-Unis" },
        { value: 9, label: "France" },
        { value: 10, label: "Grèce" },
        { value: 11, label: "Inde" },
        { value: 12, label: "Italie" },
        { value: 13, label: "Japon" },
        { value: 14, label: "Luxembourg" },
        { value: 15, label: "Mauritanie" },
        { value: 16, label: "Mexique" },
        { value: 17, label: "Portugal" },
        { value: 18, label: "Royaume-Uni" },
        { value: 19, label: "Sénégal" },
        { value: 20, label: "Suisse" },
        { value: 21, label: "Taïwan" },
        { value: 22, label: "Tunisie" },
        this.other
    ];

    // Return a valid country
    static get = countryId => {
        if (countryId) {
            const COUNTRY_ID = parseInt(countryId);
            return (this.list.some(item => item.value == COUNTRY_ID)) ? COUNTRY_ID : this.other.value;
        } else
            return this.other.value;
    };

    // Get the ID from the name and the name from the ID
    static getId = countryName => {
        const NAME = countryName.trim().toLowerCase();
        const COUNTRY = this.list.find(item => item.label.toLowerCase() == NAME);
        return (COUNTRY) ? COUNTRY.value : this.other.value;
    };
    static getName = countryId => {
        const COUNTRY = this.list.find(item => item.value == countryId);
        return (COUNTRY) ? COUNTRY.label : this.other.label;
    };

    // Initialize the field
    static init = countryId => {
        const COUNTRY_ID = parseInt(countryId) || this.other.value;
        document.getElementById(this.fieldId).select(COUNTRY_ID);
    };

    // Fill the 'country' field
    static fill = countryId => {
        const COUNTRY = document.getElementById(this.fieldId);
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
    };
}


//////////////////////////////////////////////////////////////////////////
// Manage users
//////////////////////////////////////////////////////////////////////////


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
        this.isVisible = true;
    }

    // Update methods ////////////////////////////////////////////////////

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

    // Manage the form ///////////////////////////////////////////////////

    // Fill the 'gender', 'interests' and 'country' fields
    static fill = (genderId, interestIDs, countryId) => {
        Gender.fill(genderId);
        Interests.fill(interestIDs);
        Country.fill(countryId);
    };

    // Initialize the 'gender', 'interests' and 'country' fields
    static init = (genderId, interestIDs, countryId) => {
        Gender.init(genderId);
        Interests.init(interestIDs);
        Country.init(countryId);
    };

    // Reset the form
    static reset = (genderId, interestIDs, countryId) => {
        document.querySelector("form").reset();

        Gender.init(genderId);
        Interests.init(interestIDs);
        Country.init(countryId);
    };
}


//////////////////////////////////////////////////////////////////////////
// Add, update and remove a user
//////////////////////////////////////////////////////////////////////////


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
// UTILITIES: global function for parameter validation and user retrieval by ID if necessary
function checkParams(isAdded, name, email, password, pswdConfirm, toConsole, prefixMsg = null, userId = 0) {
    // Check the parameters
    const ID = parseInt(userId);
    if (!isAdded && !ID)
        return displayLog("L'identifiant est incorrect !", toConsole, prefixMsg);

    const NAME = checkName(name);
    if (isAdded && !NAME)
        return displayLog("Le nom doit contenir au moins trois caractères non blancs !", toConsole, prefixMsg);

    const EMAIL = checkEmail(email);
    if (isAdded && !EMAIL)
        return displayLog("L'e-mail est invalide !", toConsole, prefixMsg);

    const PASSWORD = checkPassword(password);
    if (isAdded && !PASSWORD)
        return displayLog("Le mot de passe doit contenir au moins 8 caractères et aucun caractère blanc !", toConsole, prefixMsg);

    if ((isAdded || PASSWORD) && PASSWORD != pswdConfirm)
        return displayLog("La confirmation du mot de passe est incorrecte !", toConsole, prefixMsg);

    // Retrieve the users from local storage and verify that the email is not already registered
    const [USERS, USER] = lsFind("users", user => user.id == ID);

    if (!isAdded) {
        if (USERS.length == 0)
            return displayLog("Mise à jour impossible : aucun utilisateur n'est enregistré !", toConsole, prefixMsg);

        if (!USER)
            return displayLog("L'identifiant est incorrect !", toConsole, prefixMsg);

        if (EMAIL && USER.email != EMAIL && USERS.some(user => user.email == EMAIL))
            return displayLog("Cet e-mail existe déjà !", toConsole, prefixMsg);

    } else if (USERS.some(user => user.email == EMAIL))
        return displayLog("Cet e-mail existe déjà !", toConsole, prefixMsg);

    return (isAdded) ? [NAME, EMAIL, PASSWORD, USERS] : [NAME, EMAIL, PASSWORD, USERS, USER];
}

// Add a new user to local storage
function addUser(countryId = 0, toConsole = false) {
    const PREFIX_LOG = (toConsole) ? "[add user] - " : null;

    // Get the parameters
    const PARAMS = checkParams(
        true,
        document.getElementById("name-user").value,
        document.getElementById("email-user").value,
        document.getElementById("password-user").value,
        document.getElementById("password-confirm").value,
        toConsole,
        PREFIX_LOG
    );
    if (!PARAMS) return false;

    const [NAME, EMAIL, PASSWORD, USERS] = PARAMS;

    // Updating formatted fields
    document.getElementById("name-user").value = NAME;
    document.getElementById("email-user").value = EMAIL;

    let objGender = document.querySelector(`input[name="${Gender.fieldName}"]:checked`);
    const GENDER_ID = (objGender) ? Gender.get(objGender.value) : Gender.other;
    let objInterests = document.querySelectorAll(`input[name="${Interests.fieldName}"]:checked`);
    const INTEREST_IDS = (objInterests) ? Interests.get(Array.from(objInterests).map(item => item.value)) : Interests.other;
    let objCountry = document.getElementById(Country.fieldId);
    const COUNTRY_ID = Country.get(objCountry.options[objCountry.selectedIndex].value);

    // Create a new user and save it to local storage
    const USER = new User(NAME, EMAIL, PASSWORD, GENDER_ID, INTEREST_IDS, COUNTRY_ID);
    USERS.lsAddItem("users", "id", USER);

    // Reset the form and display the validation message
    User.reset(null, null, countryId);
    displayLog("Votre profile est créé.", toConsole, PREFIX_LOG);

    return true;
}

// Update a user (except their role) in local storage
function updateUser(userId, name, email, password, pswdConfirm, genderId, interestIDs, countryId, toConsole = false) {
    let prefixMsg = (toConsole) ? "[update user] - " : null;

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
    prefixMsg = (toConsole) ? `[update ${(USER.role != Role.superAdmin) ? (USER.role != Role.admin) ? "user" : "admin" : "super-admin"}] - ` : null;

    // Perform the update
    const IS_CHANGED = USER.update(NAME, EMAIL, PASSWORD, genderId, interestIDs, countryId);

    if (IS_CHANGED) {
        // Save the changes to local storage and display the confirmation message
        USERS.lsSetItems("users");
        displayLog("Votre profile a été mis à jour.", toConsole, prefixMsg);
    } else
        // No changes have been done
        displayLog("Aucune modification n'a été apportée à votre profile !", toConsole, prefixMsg);

    return true;
}

// Enable or disable a product from local storage
function setUserVisibility(userId, isVisible, toConsole = true) {
    lsGetItems("users").lsSetItemVisibility("users", "id", userId, isVisible);
    displayLog(`Votre profile a été ${(isVisible) ? "réactivé" : "archivé"}.`, toConsole, (toConsole) ? "[visibility user] - " : null);
}

// Remove a user from local storage
function removeUser(userId, toConsole = true) {
    lsGetItems("users").lsRemoveItem("users", "id", userId);
    displayLog("Votre profile a été supprimé.", toConsole, (toConsole) ? "[remove user] - " : null);
}


//////////////////////////////////////////////////////////////////////////
// Manage user login
//////////////////////////////////////////////////////////////////////////


// Save the logged-in user to session storage or local storage
function loginUser(userId, permanent) {
    if (permanent)
        localStorage.setItem("sessionId", userId);
    else
        sessionStorage.setItem("sessionId", userId);
}

function login(toConsole = false) {
    const EMAIL = document.getElementById("email-user").value.trim();
    const PASSWORD = document.getElementById("password-user").value;

    // Retrieve the users from local storage and verify that the email/password are registered
    const [USERS, USER] = lsFind("users", user => user.email == EMAIL && user.password == PASSWORD);

    if (USER) {
        // Save the user ID to session or local storage and redirect the page
        loginUser(USER.id, document.querySelector('input[id="permanent-login"]:checked'));
        window.location.href = "../index.html";
    } else {
        // Invalid login: display the error message and redirect the page
        displayLog("E-mail ou mot de passe incorrect !", toConsole, (toConsole) ? "[login] - " : null);
        window.location.href = "addUser.html";
    }
}


//////////////////////////////////////////////////////////////////////////
// BACKEND (normally): manage administrators
//////////////////////////////////////////////////////////////////////////


// Add a new admin to local storage
function addAdmin(name, email, password, pswdConfirm, genderId = 0, countryId = 0, isSuper = false, toConsole = true) {
    const PREFIX_LOG = (toConsole) ? `[add ${(isSuper) ? "super-admin" : "admin"}] - ` : null;

    // Get the parameters
    const PARAMS = checkParams(
        true,
        name,
        email,
        password,
        pswdConfirm,
        toConsole,
        PREFIX_LOG
    );
    if (!PARAMS) return false;

    const [NAME, EMAIL, PASSWORD, USERS] = PARAMS;
    const GENDER_ID = Gender.get(genderId);
    const COUNTRY_ID = Country.get(countryId);

    // Create a new admin and save it to local storage
    const ADMIN = new User(NAME, EMAIL, PASSWORD, GENDER_ID, [], COUNTRY_ID, (isSuper) ? Role.superAdmin : Role.admin);
    USERS.lsAddItem("users", "id", ADMIN);

    // Display the validation message
    displayLog("Le profile est créé.", toConsole, PREFIX_LOG);

    return true;
}

// Update a user's role in local storage
function updateRole(userId, role, toConsole = true) {
    const PREFIX_LOG = (toConsole) ? "[update user's role] - " : null;

    // Retrieve the user ID
    const ID = parseInt(userId);
    if (!ID)
        return displayLog("L'identifiant est incorrect !", toConsole, PREFIX_LOG);

    // Retrieve the list of users and the user by ID
    const [USERS, USER] = lsFind("users", user => user.id == ID);

    if (USERS.length == 0)
        return displayLog("Mise à jour impossible : aucun utilisateur n'est enregistré !", toConsole, PREFIX_LOG);

    if (!USER)
        return displayLog("L'identifiant est incorrect !", toConsole, PREFIX_LOG);

    // Retrieve the user's role
    const IS_CHANGED = USER.updateRole(role);
    if (IS_CHANGED === null)
        return displayLog("Le rôle de l'utilisateur est incorrect !", toConsole, PREFIX_LOG);

    if (IS_CHANGED) {
        // Save the change made to the user's role in local storage and display a confirmation message
        USERS.lsSetItems("users");
        displayLog("Le rôle de l'utilisateur a été mis à jour.", toConsole, PREFIX_LOG);
    } else
        // No changes have been done
        displayLog("Aucune modification n'a été apporté au rôle de l'utilisateur !", toConsole, PREFIX_LOG);

    return true;
}