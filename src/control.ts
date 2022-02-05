import { User } from "./User";
import * as inquirer from "inquirer";
import { CarManager } from "./CarManager";
import { Car } from "./car";

export class Control {
    public main(): void {
        console.log("Willkommen bei CarCarBla");
        const questions = [
            {
                type: "list",
                name: "loginOrSearch",
                message: "Wollen Sie sich anmelden, oder nach Autos suchen?",
                choices: [
                    "Anmelden",
                    "Registrieren",
                    "Suchen...",
                    "Alle Fahrzeuge anzeigen",
                ],
            },
            {
                type: "input",
                name: "login",
                message: "Bitte geben Sie Benutzernamen und Passwort ein.",
                /*validate(value){
                    //Wird hier Passwort und Benutzer überprüft?
                },*/
                when(answers) {
                    return answers.loginOrSearch == "Anmelden";
                },
            },
            {
                type: "input",
                name: "registration",
                message: "Bitte geben Sie Benutzernamen und Passwort ein.",
                /*validate(value){
                    //Wird hier Passwort und Benutzer überprüft mit Regex?
                },*/
                when(answers) {
                    return answers.loginOrSearch == "Registrieren";
                },
            },
            {
                type: "checkbox",
                name: "driveTypeElectric",
                message: "Wählen Sie die gewünschte Antriebsart",
                choices: [
                    { name: "Elektronisch", value: true },
                    { name: "Konventionell", value: false },
                ],

                when(answers) {
                    return answers.loginOrSearch == "Suchen...";
                },
            },
            {
                type: "input",
                name: "searchBrand",
                message: "Geben Sie Ihre gewünschte Marke ein",
                /*validate(value){
                    //Es muss vorgefiltert werten elektrisch/konventionell
                },*/
                when(answers) {
                    return answers.loginOrSearch == "Suchen...";
                },
            },
            {
                type: "list",
                name: "filteredCars",
                message: "Eine Liste von allen Autos",
                choices(answers) {
                    console.log("Log: " + answers.driveTypeElectric);
                    let listOfCars =
                        CarManager.getInstance().ListOfAvailableCars();
                    let choicesArray = [];
                    listOfCars.forEach((eachCar: Car) => {
                        choicesArray.push({
                            name: eachCar.printString(),
                            value: eachCar.car_ID,
                        });
                    });
                    return choicesArray;
                },
                /*validate(value){
                    //Wird hier Passwort und Benutzer überprüft mit Regex?
                },*/
                // when(answers) {
                //     return answers.loginOrSearch == 'Suchen...';
                // },
            },
            {
                type: "list",
                name: "showAllCars",
                message: "Eine Liste von allen Autos",
                choices(answers) {
                    console.log(answers.driveTypeElectric);
                    let listOfCars =
                        CarManager.getInstance().ListOfAvailableCars();
                    let choicesArray = [];
                    listOfCars.forEach((eachCar: Car) => {
                        choicesArray.push({
                            name: eachCar.printString(),
                            value: eachCar.car_ID,
                        });
                    });
                    return choicesArray;
                },
                /*validate(value){
                    //Wird hier Passwort und Benutzer überprüft mit Regex?
                },*/
                when(answers) {
                    return answers.loginOrSearch == "Alle Fahrzeuge anzeigen";
                },
            },
        ];
        inquirer.prompt(questions).then((answers) => {});
        let testUser: User = new User();
        /*testUser.pastBookedRides();
        console.log(testUser.averageCost());*/
    }
}
