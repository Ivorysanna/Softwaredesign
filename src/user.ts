import * as fs from "fs";

export class User {
    public user_ID: number;
    public isAdmin: boolean;
    public userName: string;
    public lastName: string;
    public password: string;

    constructor( user_ID: number, isAdmin: boolean,userName: string, lastName: string, password: string) {
        this.user_ID = user_ID;
        this.isAdmin = isAdmin;
        this.userName = userName;
        this.lastName = lastName;
        this. password = password;
    }

    public pastBookedRides(): String {
        let allRides = fs.readFileSync("data/rides.json");
        let outputRides = JSON.parse(allRides.toString());
        //console.log(outputRides);
        return "Bis jetzt wurden: " + outputRides + " gebucht.";
    }

    //Average Cost wird berechnet
    public averageCost(): String {
        let rawData = fs.readFileSync("data/rides.json");
        let allRides = JSON.parse(rawData.toString());
        let bookedRides = allRides["bookedRides"];
        let logAllRides = 0;
        for (let i = 0; i < bookedRides.length; i++) {
            logAllRides += bookedRides[i].price;
        }
        let averageCost = logAllRides / bookedRides.length;
        return "Durchschnittskosten betragen: " + averageCost + " €.";
    }
}
