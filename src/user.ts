import { Rides } from "./Rides";
import * as fs from "fs";

export class User{
    public user_ID: number;
    public registered: Boolean;
    public userName: string;
    public password: string;
    public averageCosts: number;
    public accumaltedAmountRides: number;

    public pastBookedRides(): String{
        let allRides = fs.readFileSync('data/bookedRides.json');
        let outputRides = JSON.parse(allRides.toString());
        console.log(outputRides);
        return "Bis jetzt wurden: " + outputRides + " gebucht.";
    }

        //Average Cost wird berechnet
    public averageCost():String{
        let rawData= fs.readFileSync('data/bookedRides.json');
        let allRides = JSON.parse(rawData.toString());
        let bookedRides = allRides["bookedRides"];
        let logAllRides = 0;
        for(let i = 0; i < bookedRides.length; i++){
            logAllRides += bookedRides[i].timeUsed;
        }
        let averageCost = logAllRides / bookedRides.length;
        return "Durchschnittskosten betragen: " + averageCost + " €.";
    }

}
