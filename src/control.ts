import { User } from "./User"

export class Control{

    public main(): void{
        let testUser: User = new User;
        testUser.pastBookedRides();
        console.log(testUser.averageCost());
        
    }
}