var Manager = null;

// Main File Systems
// This file should MOST LIKELY remain UNEDITED
//  - Exemption: Loading CORE FILE

function init() {
    Manager.enable();
}

function loadRequires() {
    Manager = require('./Managers/core.js'); // Core Manager
}

loadRequires();
init();