// main.js

// Import necessary modules and functions
import { registerSettings } from "./settings.js";
import { setupHooks } from "./hooks.js";
import { FatesFolly } from "./FatesFolly.js";
import { registerFatesFollyRollTable } from "./FFRollTableConfig.js";


// When the Foundry VTT module is initialized
Hooks.on("init", () => {
    
    console.log("%cFate\'s Folly Init", `
        color:#D01B00;
        background-color:#A3A6B4;
        font-size:9pt;
        font-weight:bold;
        padding:1pt;
    `);

    // Register module settings
    registerSettings();
    
    // Set up custom hooks
    setupHooks();
    
    // Register the Fate's Folly roll table
    registerFatesFollyRollTable();
});

// Log a message indicating that the module setup is complete
console.log("%cFate\'s Folly Module Setup Complete", `
        color:#D01B00;
        background-color:#A3A6B4;
        font-size:10pt;
        font-weight:bold;
        padding:5pt;
    `);

// Export module ID and FatesFolly class
export const MODULE_ID = "fates-folly";
export { FatesFolly };
