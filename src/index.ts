import * as inquirer from "inquirer";
inquirer.registerPrompt("date", require("inquirer-date-prompt"));
import { CarManager } from "./CarManager";
import { Car } from "./Car";
import { UserManager } from "./UserManager";
import { Utils } from "./Utils";
import { RideManager } from "./RideManager";
import { DateTime } from "luxon";

let questionAnswers: any = {};
let lastSelectedCar_ID: number;

const driveTypeQuestions = [
    { name: "Elektronisch", value: true },
    { name: "Konventionell", value: false },
];

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
        let userLoggedIn = UserManager.getInstance().loginUser(
            answers.loginUsername,
            answers.loginPassword
        );
        if (userLoggedIn) {
            console.log("Anmeldung erfolgreich!");
            loggedinCustomerMenu();
        } else {
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
        choices() {
            let choicesArray = [
                "Suchen...",
                "Alle Autos anzeigen",
                "Alle Kosten und Durchschnittskosten anzeigen",
                "Alle Fahrten anzeigen",
            ];
            if (UserManager.getInstance().getCurrentlyLoggedInUser()?.isAdmin) {
                choicesArray.push("Auto hinzufügen");
            }
            return choicesArray;
        },
    },
];

function loggedinCustomerMenu() {
    inquirer.prompt(loggedinCustomerQuestions).then((answers) => {
        switch (answers.loggedinCustomer) {
            case "Suchen...":
                searchMenu();
                break;
            case "Alle Autos anzeigen":
                showAllCarsMenu();
                break;
            case "Alle Kosten und Durchschnittskosten anzeigen":
                showAverageCost();
                break;
            case "Auto hinzufügen":
                addCarMenu();
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
        if (
            UserManager.getInstance().registerUser(
                answers.registrationUsername,
                answers.registrationPassword
            )
        ) {
            console.log("Registrierung erfolgreich. Sie werden weitergeleitet");
            loggedinCustomerMenu();
        } else {
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
        choices: driveTypeQuestions,
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
        when(answers: any) {
            let listOfCars = CarManager.getInstance().listOfAvailableCars();
            let regExp = new RegExp(answers.searchBrand, "i");
            return listOfCars.some((eachCar: Car) => {
                let match = eachCar.description.match(regExp) != null;
                if (answers.driveTypeElectric.includes(eachCar.electricDriveType) && match) {
                    return true;
                }
                return false;
            });
        },
    },
];

function searchMenu() {
    inquirer.prompt(search).then((answers) => {
        //console.log(answers);

        if (answers.filteredCars) {
            lastSelectedCar_ID = answers.filteredCars;
            showBookCar();
        } else {
            console.log("Keine Autos mit diesen Parametern gefunden");
            searchMenu();
        }
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

function showAllCarsMenu() {
    inquirer.prompt(showAllCarsQuestion).then((answers) => {
        lastSelectedCar_ID = answers.showAllCars;
        showBookCar();
    });
}

//Auto buchen
const bookCar = [
    {
        type: "date",
        name: "bookCarDate",
        message: "Geben Sie ein Datum und eine Zeit ein.",
        default: new Date(),
        locale: "de-DE",
        format: {},
        clearable: false,
        validate: (enteredDateTime: DateTime, answers: any) => {
            let carToBook = CarManager.getInstance().getCarByID(lastSelectedCar_ID);
            if (!carToBook) {
                return false;
            }

            //Prüfungen, dass Nutzungszeiten innerhalb Auto Nutzungszeit liegt
            return enteredDateTime >= DateTime.now() &&
                (enteredDateTime.hour > carToBook.earliestUsageTime.hour ||
                    (enteredDateTime.hour == carToBook.earliestUsageTime.hour &&
                        enteredDateTime.minute >= carToBook.earliestUsageTime.minute)) &&
                enteredDateTime.hour < carToBook.latestUsageTime.hour
                ? true
                : "Die Nutzungszeit darf nicht außerhalb der Nutzungszeit des Fahrzeugs liegen. Fahrt muss in der Zukunft sein (Datum)";
        },
        filter: (value: Date) => DateTime.fromJSDate(value),
    },
    {
        type: "input",
        name: "bookCarDuration",
        message: "Geben Sie die Dauer in Minuten an",
        validate: (value: any, answers: any) => {
            // https://stackoverflow.com/a/7709819/3526350
            // let diffMs = answers.carLatestUsageTime - answers.carEarliestUsageTime;
            // let diffMins = Math.floor(diffMs / 60000);

            let enteredValue = parseInt(value);

            if (isNaN(enteredValue)) {
                return "Keine Nummer eingegeben!";
            } else {
                // if (diffMins < enteredValue) {
                // return "Dauer liegt außerhalb der Nutzungszeit!";
                // } else {
                return true;
                // }
            }
        },
        filter: (value: any) => (isNaN(parseInt(value)) ? value : parseInt(value)),
    },
];

function showBookCar() {
    inquirer.prompt(bookCar).then((answers) => {});
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
        choices: driveTypeQuestions,
    },
    {
        type: "date",
        name: "carEarliestUsageTime",
        message: "Geben Sie folgenden Wert ein: Früheste Nutzungsuhrzeit",
        default: new Date("2000-01-01T10:00:00.000+01:00"),
        locale: "de-DE",
        format: { day: undefined, month: undefined, year: undefined },
        clearable: false,
    },
    {
        type: "date",
        name: "carLatestUsageTime",
        message: "Geben Sie folgenden Wert ein: Späteste Nutzungsuhrzeit",
        default: new Date("2000-01-01T20:00:00.000+01:00"),
        locale: "de-DE",
        format: { day: undefined, month: undefined, year: undefined },
        clearable: false,

        validate: (value: any, answers: any) =>
            value > answers.carEarliestUsageTime
                ? true
                : "Die späteste Zeit muss nach der frühesten liegen",
    },
    {
        type: "input",
        name: "carMaxUsageDurationMinutes",
        message: "Geben Sie folgenden Wert ein: Maximale Nutzungsdauer",
        default: 120,
        validate: (value: any, answers: any) => {
            // https://stackoverflow.com/a/7709819/3526350
            let diffMs = answers.carLatestUsageTime - answers.carEarliestUsageTime;
            let diffMins = Math.floor(diffMs / 60000);

            let enteredValue = parseInt(value);

            if (isNaN(enteredValue)) {
                return "Keine Nummer eingegeben!";
            } else {
                if (diffMins < enteredValue) {
                    return "Dauer liegt außerhalb der Nutzungszeit!";
                } else {
                    return true;
                }
            }
        },
        filter: (value: any) => (isNaN(parseInt(value)) ? value : parseInt(value)),
    },
    {
        type: "input",
        name: "carFlatRatePrice",
        message: "Geben Sie folgenden Wert ein: Pauschaler Nutzungspreis",
        //https://github.com/SBoudrias/Inquirer.js/issues/866#issuecomment-626265477
        validate: (value: any) => (isNaN(parseFloat(value)) ? "Not a number!" : true),
        filter: (value: any) => (isNaN(parseFloat(value)) ? value : parseFloat(value)),
    },
    {
        type: "input",
        name: "carPricePerMin",
        message: "Geben Sie folgenden Wert ein: Preis pro Minute",
        validate: (value: any) => (isNaN(parseFloat(value)) ? "Not a number!" : true),
        filter: (value: any) => (isNaN(parseFloat(value)) ? value : parseFloat(value)),
    },
];

function addCarMenu() {
    inquirer.prompt(addCar).then((answers) => {
        console.log(answers);

        CarManager.getInstance().addNewCar(
            answers.carDescription,
            answers.carElectricDriveType,
            answers.carEarliestUsageTime,
            answers.carLatestUsageTime,
            answers.carMaxUsageDurationMinutes,
            answers.carFlatRatePrice,
            answers.carPricePerMin
        );
        console.log("Das Auto wurde hinzugefügt");
        mainMenu();
    });
}

//Durchschnittskosten aller Fahrten
function showAverageCost() {
    let averageCostUser = "Durchschnittskosten aller Fahrten: ";
    let currentUser = UserManager.getInstance().getCurrentlyLoggedInUser();
    let accumulatedCostUser = "Kumulierter Betrag aller Fahrten: ";
    if (currentUser) {
        console.log(accumulatedCostUser + currentUser.getSumRideCost() + " €");
        console.log(averageCostUser + currentUser.getAverageRideCost() + " €");
    } else {
        console.log("Kein User angemeldet!");
    }
    loggedinCustomerMenu();
}

//Alle Fahrten anzeigen; vergangene Fahrten und gebuchte Fahrten
function showAllRides() {
    let loggedinUser = UserManager.getInstance().getCurrentlyLoggedInUser();
    if (loggedinUser) {
        let allRides = RideManager.getInstance().getRidesForUser(loggedinUser);

        allRides.forEach((eachRide) => {
            console.log(eachRide.printString());
        });
    }
    loggedinCustomerMenu();
}

mainMenu();
//let testUser: User = new User();
/*testUser.pastBookedRides();
        console.log(testUser.averageCost());*/
