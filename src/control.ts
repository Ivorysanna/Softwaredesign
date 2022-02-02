import { User } from "./User"

export class Control{

    public main(): void{
        const inquirer = require("inquirer");
        console.log("Willkommen bei CarCarBla");
        const questions = [
            {
                type:"list",
                name: "loginOrSearch",
                message: "Wollen Sie sich anmelden?",
                choices: ["Anmelden", "Registrieren", "Suchen..."],
            },
            {
                type: "input",
                name: "login",
                message: "Bitte geben Sie Benutzernamen und Passwort ein.",
                /*validate(value){
                    //Wird hier Passwort und Benutzer überprüft?
                },*/
                when(answers){
                    return answers.loginOrSearch == "Anmelden";
                }
            }
        ];
        inquirer.prompt(questions).then((answers) => {
            
          });
        let testUser: User = new User;
        /*testUser.pastBookedRides();
        console.log(testUser.averageCost());*/
        
    }
}