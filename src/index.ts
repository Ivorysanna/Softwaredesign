import { User } from "./User";
import * as inquirer from "inquirer";
import { CarManager } from "./CarManager";
import { Car } from "./Car";

let questionAnswers: any = {};

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
                console.error("Wrong menu item provided");
                break;
        }
    });
}

const login = [
    {
        type: "input",
        name: "login",
        message: "Bitte geben Sie Benutzernamen und Passwort ein.",
        when(answers: any) {
            return answers.loginOrSearch == "Anmelden";
        },
    },
];

function loginMenu() {
    inquirer.prompt(login);
}

const registration = [
    {
        type: "input",
        name: "registration",
        message: "Bitte geben Sie Benutzernamen und Passwort ein.",
        when(answers: any) {
            return answers.loginOrSearch == "Registrieren";
        },
    },
];

function registrationMenu() {
    inquirer.prompt(registration);
}

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
        message: "Eine gefilterte Liste von allen Autos",
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
        when(answers: any) {
            return answers.loginOrSearch == "Alle Fahrzeuge anzeigen";
        },
    },
];

function showAllCarsMenu(){
    inquirer.prompt(showAllCars);
}

mainMenu();
//let testUser: User = new User();
/*testUser.pastBookedRides();
        console.log(testUser.averageCost());*/
