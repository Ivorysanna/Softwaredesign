import { User } from "./User";
import * as inquirer from "inquirer";
import { CarManager } from "./CarManager";
import { Car } from "./Car";
import { UserManager } from "./UserManager";
import { Console } from "console";
import { DateTime } from "luxon";
import { Utils } from "./Utils";

let questionAnswers: any = {};
let lastSelectedCar_ID: number;
//Main Menü 
const mainMenuQuestions = [
    {
        type: "list",
        name: "loginOrSearch",
        message: "Wollen Sie sich anmelden, oder nach Autos suchen?",
        choices: ["Anmelden", "Registrieren", "Suchen...", "Alle Fahrzeuge anzeigen"],
    },
];

function mainMenu() {
    inquirer.prompt(mainMenuQuestions).then((answers) => {
        switch (answers.loginOrSearch) {
            case "Anmelden":
                loginMenu();
                break;
            case "Registrieren":
                registrationMenu();
                break;
            case "Suchen...":
                searchMenu();
                break;
            case "Alle Fahrzeuge anzeigen":
                showAllCarsMenu();
                break;
            default:
                console.error("Falschen Menüpunkt ausgewählt");
                break;
        }
    });
}

//Anmeldung
const login = [
    {
        type: "input",
        name: "loginUsername",
        message: "Bitte geben Sie Ihren Benutzernamen ein.",
    },
    {
        type: "password",
        name: "loginPassword",
        message: "Bitte geben Sie Ihr Passwort ein.",
    },
    
];

function loginMenu() {
    inquirer.prompt(login).then((answers) => {
        let userLoggedIn = UserManager.getInstance().loginUser(answers.loginUsername, answers.loginPassword);
        if (userLoggedIn){
            console.log("Anmeldung erfolgreich!");
            loggedinCustomerMenu();
        }else{
            console.log("Anmeldung fehlgeschlagen.");
            mainMenu();
        }
    });
}

//Menu für angemeldete Kunden
const loggedinCustomerQuestions = [
    {
        type: "list",
        name: "loggedinCustomer",
        message: "Wie möchten Sie weiter fortfahren?",
        choices: ["Nach Autos suchen", "Durchschnittskosten anzeigen", "Alle Fahrten anzeigen"],
    },
];

function loggedinCustomerMenu() {
    inquirer.prompt(loggedinCustomerQuestions).then((answers) => {
        switch (answers.loggedinCustomer){
            case "Nach Autos suchen":
                mainMenu();
                break;
            case "Durchschnittskosten anzeigen":
                showAverageCost();
                break;
            case "Alle Fahrten anzeigen":
                showAllRides();
                break;
        }
    });
}

//Registrierung
const registration = [
    {
        type: "input",
        name: "registrationUsername",
        message: "Bitte geben Sie Ihren Benutzernamen ein.",
    },
    {
        type: "password",
        name: "registrationPassword",
        message: "Bitte geben Sie Ihr Passwort ein.",
    },
];

function registrationMenu() {
    inquirer.prompt(registration).then((answers) => {
     if (UserManager.getInstance().registerUser(answers.registrationUsername, answers.registrationPassword)){
            console.log("Registrierung erfolgreich. Sie werden weitergeleitet")
            loggedinCustomerMenu();
        }else{
          console.log("Registrierung nicht erfolgreich, probieren Sie es nochmal");
          mainMenu();
        }
    });
}

//Suche mit Filtern
const search = [
    {
        type: "checkbox",
        name: "driveTypeElectric",
        message: "Wählen Sie die gewünschte Antriebsart",
        choices: [
            { name: "Elektronisch", value: true },
            { name: "Konventionell", value: false },
        ],
        validate(value: any) {
            if (value.length > 0) {
                return true;
            } else {
                return "Mindestens eine Antriebsart auswählen!";
            }
        },
    },
    {
        type: "input",
        name: "searchBrand",
        message: "Geben Sie Ihre gewünschte Marke ein",
        validate(value: any) {
            if (value.length > 0) {
                return true;
            } else {
                return "Bitte geben Sie einen Suchbegriff ein!";
            }
        },
    },
    {
        type: "list",
        name: "filteredCars",
        message: "Eine gefilterte Liste von allen Autos. Wählen Sie ein Auto aus.",
        choices(answers: any) {
            let listOfCars = CarManager.getInstance().listOfAvailableCars();
            let choicesArray: any = [];
            let regExp = new RegExp(answers.searchBrand, "i");
            listOfCars.forEach((eachCar: Car) => {
                let match = eachCar.description.match(regExp) != null;
                if (answers.driveTypeElectric.includes(eachCar.electricDriveType) && match) {
                    choicesArray.push({
                        name: eachCar.printString(),
                        value: eachCar.car_ID,
                    });
                }
            });
            return choicesArray;
        },
    },
];

function searchMenu() {
    inquirer.prompt(search).then((answers) => {
        console.log(answers);
    });
}

//Liste von allen Autos anzeigen 
//TODO: Fahrzeuge die vorhanden sind, andere ensprechend markieren
const showAllCarsQuestion = [
    {
        type: "list",
        name: "showAllCars",
        message: "Eine Liste von allen Autos",
        choices(answers: any) {
            console.log(answers.driveTypeElectric);
            let listOfCars = CarManager.getInstance().listOfAvailableCars();
            let choicesArray: any = [];
            listOfCars.forEach((eachCar: Car) => {
                choicesArray.push({
                    name: eachCar.printString(),
                    value: eachCar.car_ID,
                });
            });
            return choicesArray;
        },
    },
];

function showAllCarsMenu(){
    inquirer.prompt(showAllCarsQuestion).then((answers) => {
        lastSelectedCar_ID = answers.showAllCars;
        showBookCar();
    });
}

//Auto buchen
const bookCar = [
    {
        type: "input",
        name: "bookCarDate",
        message: "Geben Sie ein Datum und eine Zeit ein (z.b. Format 31.01.2022 14:00)",
        validate(value: any){
            const dateTime = Utils.parseDateTimeString(value);
            return dateTime.isValid;
        },
    },
    {
        type: "input",
        name: "bookCarDuration",
        message: "Geben Sie die Dauer in Minuten an",
        validate(value: any) {
            return !isNaN(parseInt(value));
        },

    },
];

function showBookCar(){
    inquirer.prompt(bookCar).then((answers) => {

    });
}

//Auto hinzufügen
const addCar = [
    //Auto hinzufügen
    {
        type: "input",
        name: "carDescription",
        message: "Geben Sie folgenden Wert ein: Marke",
    },
    {
        type: "list",
        name: "carElectricDriveType",
        message: "Wählen Sie die Antriebsart",
        choices: [
            { name: "Elektronisch", value: true },
            { name: "Konventionell", value: false },
        ]
    },
    {
        type: "input",
        name: "carEarliestUsageTime",
        message: "Geben Sie folgenden Wert ein: Früheste Nutzungsuhrzeit",
    },
    {
        type: "input",
        name: "carLatestUsageTime",
        message: "Geben Sie folgenden Wert ein: Späteste Nutzungsuhrzeit",
    },
    {
        type: "input",
        name: "carMaxUsageDurationMinutes",
        message: "Geben Sie folgenden Wert ein: Maximale Nutzungsdauer",
        validate(value: any) {
            return !isNaN(parseInt(value));
        },
    },
    {
        type: "input",
        name: "carFlatRatePrice",
        message: "Geben Sie folgenden Wert ein: Pauschaler Nutzungspreis",
        validate(value: any) {
            return !isNaN(parseFloat(value));
        },
    },
    {
        type: "input",
        name: "carPricePerMin",
        message: "Geben Sie folgenden Wert ein: Preis pro Minute",
        validate(value: any) {
            return !isNaN(parseFloat(value));
        },
    },
    
];

function addCarMenu(){
    inquirer.prompt(addCar);
}

//Durchschnittskosten aller Fahrten
function showAverageCost(){
    console.log("Durchschnittskosten aller Fahrten");

}

//Alle Fahrten anzeigen; vergangene Fahrten und gebuchte Fahrten
function showAllRides(){
    let loggedinUser = UserManager.getInstance().getCurrentlyLoggedInUser();
    let allRides = 
    if(loggedinUser){

        console.log();
    }
}



mainMenu();
//let testUser: User = new User();
/*testUser.pastBookedRides();
        console.log(testUser.averageCost());*/
