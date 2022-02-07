import { User } from "./User";
import * as inquirer from "inquirer";
import { CarManager } from "./CarManager";
import { Car } from "./Car";

let questionAnswers: any = {};
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
        name: "login",
        message: "Bitte geben Sie Benutzernamen und Passwort ein.",
    },
];

function loginMenu() {
    inquirer.prompt(login);
}

//Menu für angemeldete Kunden
const logedinCustomer = [
    {
        type: "input",
        name: "logedinCustomer",
        message: "Wie möchten Sie weiter fortfahren?",
        choices: ["Nach Autos suchen", "Durchschnittskosten anzeigen", "Alle Fahrten anzeigen"],
    },
];

function logedinCustomerMenu() {
    inquirer.prompt(mainMenuQuestions).then((answers) => {
        switch (answers.logedinCustomer){
            case "Nach Autos suchen":
                mainMenu();
                break;
            case "Durchschnittskosten anzeigen":
                showAverageCost()
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
        name: "registration",
        message: "Bitte geben Sie Benutzernamen und Passwort ein.",
    },
];

function registrationMenu() {
    inquirer.prompt(registration);
    if (/*Registrierung erfolgreich*/ ){
        loginMenu();
    }else{
        console.log("Registrierung nicht erfolgreich, probieren Sie es nochmal");
    }
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
            let listOfCars = CarManager.getInstance().ListOfAvailableCars();
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
    inquirer.prompt(search);
}

//Liste von allen Autos anzeigen 
//TODO: Fahrzeuge die vorhanden sind, andere ensprechend markieren
const showAllCars = [
    {
        type: "list",
        name: "showAllCars",
        message: "Eine Liste von allen Autos",
        choices(answers: any) {
            console.log(answers.driveTypeElectric);
            let listOfCars = CarManager.getInstance().ListOfAvailableCars();
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

function showAllCarsMenu() {
    inquirer.prompt(showAllCars);
}

//Auto buchen
const bookCar = [
    // Auto buchen
    console.log("Auto buchen"),
];

function showbookCar(){
    inquirer.prompt(bookCar);
}

//Auto hinzufügen
const addCar = [
    //Auto hinzufügen
    console.log("Auto hinzufügen"),
    
];

function addCarMenu(){
    inquirer.prompt(addCar);
}

//Durchschnittskosten aller Fahrten
const averageCost = [
    //ausgabe Durchschnittskosten aller Fahrten
    console.log("Average Cost"),
];

function showAverageCost(){
    inquirer.prompt(averageCost);
}

//Alle Fahrten anzeigen; vergangene Fahrten und gebuchte Fahrten
const allRides = [
    //Alle Rides zeigen kommende und alte
    console.log("Alle Fahrten"),
];

function showAllRides(){
    inquirer.prompt(allRides);
}



mainMenu();
//let testUser: User = new User();
/*testUser.pastBookedRides();
        console.log(testUser.averageCost());*/
