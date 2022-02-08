import * as fs from "fs";
import { User } from "./User";

export class UserManager {
    // Singleton data
    private currentlyLoggedInUser?: User = undefined;

    //Singleton für einfachen Zugriff auf UserManager
    private static instance: UserManager;

    private constructor() {}

    public static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }

        return UserManager.instance;
    }
    public listOfAvailableUsers(): User[] {
        let rawData = fs.readFileSync("data/users.json");
        let userData = JSON.parse(rawData.toString());
        let userObjects: User[] = [];
        userData.forEach((element: any) => {
            let newUser = new User(
                element.user_ID,
                element.isAdmin,
                element.username,
                element.password
            );
            userObjects.push(newUser);
        });
        return userObjects;
    }

    // TODO
    public loginUser(username: string, password: string): boolean {
        const userToLogin = this.getUserByName(username);

        if (!userToLogin) {
            return false;
        }

        const loginSuccessful: boolean = userToLogin.password == password;

        if (loginSuccessful) {
            this.currentlyLoggedInUser = userToLogin;
        }

        return loginSuccessful;
    }

    public getUserByName(username: string): User | undefined {
        const userList: User[] = this.listOfAvailableUsers();

        return userList.find((eachUser) => eachUser.username == username);
    }

    public getUserByID(idToSearch: number): User | undefined {
        const userList: User[] = this.listOfAvailableUsers();

        return userList.find((eachUser) => eachUser.user_ID == idToSearch);
    }

    public registerUser(username: string, password: string): boolean {
        const userList: User[] = this.listOfAvailableUsers();

        if (userList.some((eachUser) => eachUser.username == username)) {
            return false;
        }

        let newUserID: number = 1;
        while (
            userList.some((eachUser) => {
                eachUser.user_ID == newUserID;
            })
        ) {
            newUserID++;
        }

        const newUser = new User(newUserID, false, username, password);
        userList.push(newUser);

        fs.writeFileSync("data/users.json", JSON.stringify(userList));

        this.currentlyLoggedInUser = newUser;

        return true;
    }

    public getCurrentlyLoggedInUser(): User | undefined {
        return this.currentlyLoggedInUser;
    }
}
