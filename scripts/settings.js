// settings.js

//import { registerFatesFollyRollTable, unregisterFatesFollyRollTable } from "./FFRollTableConfig.js";
//import { removeCustomHooks } from "./hooks.js";
import { MODULE_ID } from "./main.js";

export function registerSettings() {
    
    game.settings.register(MODULE_ID, "enableCriticals", {
        name: "Enable Critical Enhancements",
        hint: "If enabled, critical enhancements will be processed.",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: value => {
            console.log("Critical hit enhancements are now " + (value ? "enabled" : "disabled"));
        }
    });

    game.settings.register(MODULE_ID, "enableFumbles", {
        name: "Enable Fumble Enhancements",
        hint: "If enabled, fumble enhancements will be processed.",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: value => {
            console.log("Fumble enhancements are now " + (value ? "enabled" : "disabled"));
        }
    });

    game.settings.register(MODULE_ID, "enableDebug", {
        name: "Enable DEBUG",
        hint: "Turns the Fate's Folly DEBUG on or off. A good deal of console logs.",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        onChange: value => {
            console.log("Fumble enhancements are now " + (value ? "enabled" : "disabled"));
        }
    });    

    /*game.settings.register(MODULE_ID, "enableModule", {
        name: "Enable Fate's Folly",
        hint: "Turns the entire Fate's Folly module on or off.",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: enabled => {
            if (enabled) {
                registerFatesFollyRollTable();
            } else {
                removeCustomHooks();
                unregisterFatesFollyRollTable();                
            }
            console.log("%cFate\'s Folly \n Module Enabled:", `
                color:#D01B00;
                background-color:#A3A6B4;
                font-size:12pt;
                font-weight:bold;
                padding:10pt;
            ` + enabled);
        }
    });*/
}