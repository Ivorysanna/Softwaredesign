import * as inquirer from "inquirer";
inquirer.registerPrompt("date", require("inquirer-date-prompt"));
import { CarManager } from "./CarManager";
import { Car } from "./Car";
import { UserManager } from "./UserManager";
import { Utils } from "./Utils";
import { RideManager } from "./RideManager";
import { DateTime, Duration } from "luxon";
import { Ride } from "./Ride";

let lastSelectedCar_ID: number;

const driveTypeQuestions = [
    { name: "Elektronisch", value: true },
    { name: "Konventionell", value: false },
];

//Main Menü
function mainMenu() {
    const mainMenuQuestions = [
        {
            type: "list",
            name: "loginOrSearch",
            message: "Wollen Sie sich anmelden, oder nach Autos suchen?",
            choices: [
                "Anmelden",
                "Registrieren",
                "Suchen...",
                "Fahrzeug nach Datum, Uhrzeit, Dauer filtern",
                "Alle Fahrzeuge anzeigen",
            ],
        },
    ];
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
            case "Fahrzeug nach Datum, Uhrzeit, Dauer filtern":
                filterForDateTimeDurationMenu();
                break;
            default:
                console.error("Falschen Menüpunkt ausgewählt");
                break;
        }
    });
}

//Anmeldung
function loginMenu() {
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

//Menu für angemeldete User
function loggedinCustomerMenu() {
    const loggedinCustomerQuestions = [
        {
            type: "list",
            name: "loggedinCustomer",
            message: "Wie möchten Sie weiter fortfahren?",
            choices() {
                let choicesArray = [
                    "Suchen...",
                    "Fahrzeug nach Datum, Uhrzeit, Dauer filtern",
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

    inquirer.prompt(loggedinCustomerQuestions).then((answers) => {
        switch (answers.loggedinCustomer) {
            case "Suchen...":
                searchMenu();
                break;
            case "Fahrzeug nach Datum, Uhrzeit, Dauer filtern":
                filterForDateTimeDurationMenu();
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
function registrationMenu() {
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
function searchMenu() {
    const filterDriveTypeAndDescriptionQuestions = [
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
    ];
    inquirer.prompt(filterDriveTypeAndDescriptionQuestions).then((answers) => {
        filteredCarsList(answers.searchBrand, answers.driveTypeElectric);
    });
}

function filteredCarsList(carDescriptionSearchTerm: string, carDriveType: boolean[]) {
    let listOfCars = CarManager.getInstance().listOfAvailableCars();
    let filteredCars: Car[] = [];
    let regExp = new RegExp(carDescriptionSearchTerm, "i");
    listOfCars.forEach((eachCar: Car) => {
        let match = eachCar.description.match(regExp) != null;
        if (carDriveType.includes(eachCar.electricDriveType) && match) {
            filteredCars.push(eachCar);
        }
    });

    inquirer.prompt(createShowCarsQuestionFromCarList(filteredCars)).then((answers) => {
        if (answers.carChoice) {
            lastSelectedCar_ID = answers.carChoice;
            if (UserManager.getInstance().isLoggedInUser()) {
                showBookCar();
            } else {
                console.log("Sie sind nicht angemeldet, bitte melden Sie sich erst an!");
                mainMenu();
            }
        } else {
            console.log("Keine Autos mit diesen Parametern gefunden");
            searchMenu();
        }
    });
}

// Erstellen von eine Car Liste
function createShowCarsQuestionFromCarList(carList: Car[]): any {
    return [
        {
            type: "list",
            name: "carChoice",
            message: "Auto zum Buchen auswählen",
            pageSize: 5,
            choices(answers: any) {
                let choicesArray: any = [];
                carList.forEach((eachCar: Car) => {
                    choicesArray.push({
                        name: eachCar.printString(),
                        value: eachCar.car_ID,
                    });
                });
                return choicesArray;
            },
            when(answers: any) {
                return carList.length > 0;
            },
        },
    ];
}

//Alle Autos hinzufügen
function showAllCarsMenu() {
    let listOfCars = CarManager.getInstance().listOfAvailableCars();
    inquirer.prompt(createShowCarsQuestionFromCarList(listOfCars)).then((answers) => {
        if (!UserManager.getInstance().isLoggedInUser()) {
            console.log("Sie sind nicht angemeldet, bitte melden Sie sich erst an!");
            mainMenu();
        } else if (!answers.carChoice) {
            console.log("Kein Auto gefunden...");
            mainMenu();
        } else {
            lastSelectedCar_ID = answers.carChoice;
            showBookCar();
        }
    });
}

//Auto buchen
function showBookCar(carDateTime: Date = new Date(), carDuration: number = 30) {
    const bookCar = [
        {
            type: "date",
            name: "bookCarDate",
            message: "Geben Sie ein Datum und eine Zeit ein.",
            default: carDateTime,
            locale: "de-DE",
            format: {},
            clearable: false,
            validate: (enteredDateTime: DateTime, answers: any) => {
                let carToBook = CarManager.getInstance().getCarByID(lastSelectedCar_ID);
                if (!carToBook) {
                    return "Kein Auto ausgewählt.";
                }

                //Prüfungen, ob Nutzungszeiten innerhalb Auto Nutzungszeit liegt
                if (
                    enteredDateTime >= DateTime.now() &&
                    carToBook.isDateTimeBetweenEarliestAndLatestUsageTime(enteredDateTime)
                ) {
                    if (carToBook!.existingRideContainsStartDateTime(enteredDateTime)) {
                        return "Auto wurde in diesem Zeitraum bereits gebucht";
                    } else {
                        return true;
                    }
                } else {
                    return "Die Nutzungszeit darf nicht außerhalb der Nutzungszeit des Fahrzeugs liegen. Fahrt muss in der Zukunft sein (Datum)";
                }
            },
            filter: (value: Date) => DateTime.fromJSDate(value),
        },
        {
            type: "input",
            name: "bookCarDuration",
            default: carDuration,
            message: "Geben Sie die Dauer in Minuten an",
            validate: (rawValue: any, answers: any) => {
                let carToBook = CarManager.getInstance().getCarByID(lastSelectedCar_ID);
                if (!carToBook) {
                    return false;
                }

                let parsedValue = parseInt(rawValue);

                if (isNaN(parsedValue)) {
                    return "Keine Nummer eingegeben!";
                } else {
                    if (carToBook.maxUsageDurationMinutes < parsedValue) {
                        return "Dauer länger als maximale Nutzungsdauer des Fahrzeugs";
                    }

                    const duration = Duration.fromObject({ minutes: parsedValue });

                    let bookingEndDateTime = answers.bookCarDate.plus(duration);

                    if (
                        !carToBook.isIntervalBetweenEarliestAndLatestUsageTime(
                            answers.bookCarDate,
                            duration
                        )
                    ) {
                        return "Länger als Nutzungszeit des Fahrzeugs";
                    }
                    if (
                        carToBook!.hasAlreadyBookedRidesInTimeAndDuration(
                            answers.bookCarDate,
                            duration
                        )
                    ) {
                        return "Auto wurde in diesem Zeitraum bereits gebucht";
                    } else {
                        return true;
                    }
                }
            },
            filter: (value: any) => (isNaN(parseInt(value)) ? value : parseInt(value)),
        },
    ];
    inquirer.prompt(bookCar).then((answers) => {
        let rideDraft = new Ride(
            answers.bookCarDate,
            Duration.fromObject({ minutes: answers.bookCarDuration }),
            UserManager.getInstance().getCurrentlyLoggedInUser()!,
            CarManager.getInstance().getCarByID(lastSelectedCar_ID)!
        );

        console.log("Gesamter Fahrtpreis: " + rideDraft.getFullPrice());
        console.log("Fahrt wurde gebucht!");
        RideManager.getInstance().saveRideToJson(rideDraft);
        mainMenu();
    });
}

//Nach Fahrzeug filtern: Datum, Uhrzeit, Dauer
function filteredCarListDateTimeDuration(carDateTime: DateTime, carDuration: Duration) {
    let filteredCarsOutput: Car[] = CarManager.getInstance().getCarsWithoutRidesInInterval(
        carDateTime,
        carDuration
    );
    inquirer.prompt(createShowCarsQuestionFromCarList(filteredCarsOutput)).then((answers) => {
        if (answers.carChoice) {
            lastSelectedCar_ID = answers.carChoice;
            if (UserManager.getInstance().isLoggedInUser()) {
                showBookCar(carDateTime.toJSDate(), carDuration.minutes);
            } else {
                console.log("Sie sind nicht angemeldet, bitte melden Sie sich erst an!");
                mainMenu();
            }
        } else {
            console.log("Keine Autos mit diesen Parametern gefunden");
            mainMenu();
        }
    });
}

function filterForDateTimeDurationMenu() {
    const filterForDateTimeDurationQuestions = [
        {
            type: "date",
            name: "filterCarDateAndTime",
            message: "Geben Sie die gewünschte Uhrzeit und das gewünschte Datum ein",
            locale: "de-DE",
            clearable: false,
            filter: (value: Date) => DateTime.fromJSDate(value),
            //Validieren, ob Datum nicht in Vergangenheit liegt
            validate: (enteredDateTime: DateTime, answers: any) => {
                if (enteredDateTime < DateTime.now()) {
                    return "Datum liegt in der Vergangenheit";
                } else {
                    return true;
                }
            },
        },
        {
            type: "input",
            name: "filterCarDuration",
            message: "Geben Sie die Dauer in Minuten an",
            validate: (rawValue: any, answers: any) => {
                let parsedValue = parseInt(rawValue);

                if (isNaN(parsedValue)) {
                    return "Keine Nummer eingegeben!";
                } else {
                    return true;
                }
            },
            filter: (value: any) => (isNaN(parseInt(value)) ? value : parseInt(value)),
        },
    ];
    inquirer.prompt(filterForDateTimeDurationQuestions).then((answers) => {
        filteredCarListDateTimeDuration(
            answers.filterCarDateAndTime,
            Duration.fromObject({ minutes: answers.filterCarDuration })
        );
    });
}

//Auto hinzufügen
function addCarMenu() {
    const addCar = [
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
            default: new Date("2000-01-01T10:00:00"),
            locale: "de-DE",
            format: { day: undefined, month: undefined, year: undefined },
            clearable: false,
            filter: (value: Date) => DateTime.fromJSDate(value),
        },
        {
            type: "date",
            name: "carLatestUsageTime",
            message: "Geben Sie folgenden Wert ein: Späteste Nutzungsuhrzeit",
            default: new Date("2000-01-01T20:00:00"),
            locale: "de-DE",
            format: { day: undefined, month: undefined, year: undefined },
            clearable: false,

            //Datum validieren
            validate: (value: any, answers: any) =>
                value > answers.carEarliestUsageTime
                    ? true
                    : "Die späteste Zeit muss nach der frühesten liegen",
            filter: (value: Date) => DateTime.fromJSDate(value),
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
