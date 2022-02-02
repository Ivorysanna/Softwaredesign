import { User } from "./User"
import * as inquirer from "inquirer";

export class Control{

    public main(): void{
        console.log("Willkommen bei CarCarBla");
        const questions = [
            {
                type:"list",
                name: "loginOrSearch",
                message: "Wollen Sie sich anmelden, oder nach Autos suchen?",
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
            },
            {
                type: "input",
                name: "registration",
                message: "Bitte geben Sie Benutzernamen und Passwort ein.",
                /*validate(value){
                    //Wird hier Passwort und Benutzer überprüft mit Regex?
                },*/
                when(answers){
                    return answers.loginOrSearch == "Registrieren";
                }
            },
            {
                type: "list",
                name: "driveType",
                message: "Wählen Sie die gewünschte Antriebsart",
                choices: ["Elektronisch", "Konventionell"],
                
                when(answers){
                    return answers.loginOrSearch == "Suchen...";
                }
            },
            {
                type: "input",
                name: "searchBrand",
                message: "Geben Sie Ihre gewünschte Marke ein",
                /*validate(value){
                    //Es muss vorgefiltert werten elektrisch/konventionell
                },*/
                when(answers){
                    return answers.driveType == "Elektronisch" || "Konventionell";
                }
            },
        ];
        inquirer.prompt(questions).then((answers) => {
            
          });
        let testUser: User = new User;
        /*testUser.pastBookedRides();
        console.log(testUser.averageCost());*/
        
    }
}