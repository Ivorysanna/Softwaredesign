import { DateTime } from "luxon";
import { Car } from "./Car";

//Test um Auto hinzuzufügen 
let testCar: Car = new Car(
    1,
    "VW Golf",
    true,
    DateTime.fromISO("2000-01-01T14:00:00.000+01:00"),
    DateTime.fromISO("2000-01-01T20:00:00.000+01:00"),
    60,
    30,
    2
);

test("test car print string", () => {
    expect(testCar.printString()).toBe(
        "VW Golf : (E) 14:00 - 20:00 Uhr, 30 € Nutzungspreis 2 € pro Min."
    );
});
