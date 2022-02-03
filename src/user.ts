import * as fs from "fs";

export class User{
    public user_ID: number;
    public userName: string;
    public lastName: string;
    public password: string;
    

    public pastBookedRides(): String{
        let allRides = fs.readFileSync('data/rides.json');
        let outputRides = JSON.parse(allRides.toString());
        //console.log(outputRides);
        return "Bis jetzt wurden: " + outputRides + " gebucht.";
    }

        //Average Cost wird berechnet
    public averageCost():String{
        let rawData= fs.readFileSync('data/rides.json');
        let allRides = JSON.parse(rawData.toString());
        let bookedRides = allRides["bookedRides"];
        let logAllRides = 0;
        for(let i = 0; i < bookedRides.length; i++){
            logAllRides += bookedRides[i].price;
        }
        let averageCost = logAllRides / bookedRides.length;
        return "Durchschnittskosten betragen: " + averageCost + " €.";
    }

}
