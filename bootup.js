const Manager = require('./Managers/core.js');;

// Main File Systems
// This file should MOST LIKELY remain UNEDITED
//  - Exemption: Loading CORE FILE

process.on("unhandledRejection", (reason, promise) => {
    console.error(`Unhandled promise rejection, ${reason}`);
    promise.catch(e => { console.log("Catched promise error.") });
})

Manager.enable();