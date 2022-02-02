import { BookedRides } from "./bookedRides";
import { PassedBookedRides } from "./passedBookedRides";
import * as fs from "fs";

export class User{
    public registered: Boolean;
    public userName: string;
    public password: string;
    public bookedRides: BookedRides[];
    //public pastBookedRides: PassedBookedRides[];
    public averageCosts: number;
    public accumaltedAmountRides: number;

    public pastBookedRides(): String{
        let allRides = fs.readFileSync('data/bookedRides.json');
        let outputRides = JSON.parse(allRides.toString());
        console.log(outputRides);
        return "Bis jetzt wurden: " + outputRides + " gebucht.";
    }

    public averageCost():String{
        let rawData= fs.readFileSync('data/bookedRides.json');
        let allRides = JSON.parse(rawData.toString());
        let bookedRides = allRides["bookedRides"];
        let logAllRides = 0;
        for(let i = 0; i < bookedRides.length; i++){
            logAllRides += bookedRides[i].timeUsed;
        }
        let averageCost = logAllRides / bookedRides.length;
        //console.log(averageCost);
        //let averageCost = logAllRides
        return "Durchschnittskosten betragen: " + averageCost + " €.";
    }

}
