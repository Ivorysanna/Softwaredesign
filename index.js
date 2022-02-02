"use strict";
exports.__esModule = true;
var CarManager_1 = require("./src/CarManager");
var Control_1 = require("./src/Control");
var control = new Control_1.Control();
CarManager_1.CarManager.getInstance().ListOfAvailableCars();
//control.main()
