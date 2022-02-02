import { CarManager } from "./src/CarManager";
import { Control } from "./src/Control";
let control: Control = new Control();
CarManager.getInstance().ListOfAvailableCars();
//control.main()