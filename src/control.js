"use strict";
exports.__esModule = true;
exports.Control = void 0;
var User_1 = require("./User");
var inquirer = require("inquirer");
var CarManager_1 = require("./CarManager");
var Control = /** @class */ (function () {
    function Control() {
    }
    Control.prototype.main = function () {
        console.log('Willkommen bei CarCarBla');
        var questions = [
            {
                type: 'list',
                name: 'loginOrSearch',
                message: 'Wollen Sie sich anmelden, oder nach Autos suchen?',
                choices: [
                    'Anmelden',
                    'Registrieren',
                    'Suchen...',
                    'Alle Fahrzeuge anzeigen',
                ]
            },
            {
                type: 'input',
                name: 'login',
                message: 'Bitte geben Sie Benutzernamen und Passwort ein.',
                /*validate(value){
                    //Wird hier Passwort und Benutzer überprüft?
                },*/
                when: function (answers) {
                    return answers.loginOrSearch == 'Anmelden';
                }
            },
            {
                type: 'input',
                name: 'registration',
                message: 'Bitte geben Sie Benutzernamen und Passwort ein.',
                /*validate(value){
                    //Wird hier Passwort und Benutzer überprüft mit Regex?
                },*/
                when: function (answers) {
                    return answers.loginOrSearch == 'Registrieren';
                }
            },
            {
                type: 'checkbox',
                name: 'driveTypeElectric',
                message: 'Wählen Sie die gewünschte Antriebsart',
                choices: [
                    { name: 'Elektronisch', value: true },
                    { name: 'Konventionell', value: false },
                ],
                when: function (answers) {
                    return answers.loginOrSearch == 'Suchen...';
                }
            },
            {
                type: 'input',
                name: 'searchBrand',
                message: 'Geben Sie Ihre gewünschte Marke ein'
            },
            {
                type: 'list',
                name: 'showAllCars',
                message: 'Eine Liste von allen Autos',
                choices: function (answers) {
                    var listOfCars = CarManager_1.CarManager.getInstance().ListOfAvailableCars();
                    var choicesArray = [];
                    listOfCars.forEach(function (eachCar) {
                        choicesArray.push({ name: eachCar.printString(), value: eachCar.car_ID });
                    });
                    return choicesArray;
                },
                /*validate(value){
                    //Wird hier Passwort und Benutzer überprüft mit Regex?
                },*/
                when: function (answers) {
                    return answers.loginOrSearch == 'Alle Fahrzeuge anzeigen';
                }
            },
        ];
        inquirer.prompt(questions).then(function (answers) { });
        var testUser = new User_1.User();
        /*testUser.pastBookedRides();
        console.log(testUser.averageCost());*/
    };
    return Control;
}());
exports.Control = Control;
