// main.js

import { registerSettings } from "./settings.js";
import { setupHooks } from "./hooks.js";
import { FatesFolly } from "./FatesFolly.js";
import { registerFatesFollyRollTable } from "./FFRollTableConfig.js";


Hooks.on("init", () =>
{
    console.log("%cFate\'s Folly Init", `
        color:#D01B00;
        background-color:#A3A6B4;
        font-size:10pt;
        font-weight:bold;
        padding:5pt;
    `);
    registerSettings();
    setupHooks();
    registerFatesFollyRollTable();
});
console.log("%cFate\'s Folly Module Setup Complete", `
        color:#D01B00;
        background-color:#A3A6B4;
        font-size:10pt;
        font-weight:bold;
        padding:5pt;
    `);

export const MODULE_ID = "fates-folly";
export { FatesFolly };
