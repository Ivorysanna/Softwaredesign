import { User } from "./user"

export class Control{

    public main(): void{
        let testUser: User = new User;
        testUser.pastBookedRides();
        console.log(testUser.averageCost());
        
    }
}