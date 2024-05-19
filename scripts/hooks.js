// hooks.js for "Fate's Folly"

import { FatesFolly } from "./FatesFolly.js";

/**
 * Handles the completion of a roll workflow.
 * 
 * @param {Object} workflow - The roll workflow object.
 */
async function handleRollComplete(workflow) {
    console.log("%cFate\'s Folly RollComplete Hook \n **** The Beginning ****", `
        color:#D01B00;
        background-color:#A3A6B4;
        font-size:10pt;
        font-weight:bold;
        padding:5pt;
    `, workflow);
    let fatesFolly = new FatesFolly(workflow);
    if (workflow.isCritical || workflow.isFumble) {
        fatesFolly.tableDrawListener(workflow.isCritical, workflow.isFumble);
        fatesFolly.processRoll(workflow.isCritical, workflow.item.type, workflow.item.labels.damageTypes);
    }
}

/**
 * Sets up hooks for Fate's Folly.
 */
export function setupHooks() {
    console.log("%cFate\'s Folly RollComplete Set", `
        color:#D01B00;
        background-color:#A3A6B4;
        font-size:10pt;
        font-weight:bold;
        padding:5pt;
    `);
    Hooks.on("midi-qol.RollComplete", handleRollComplete);
}

/**
 * Removes custom hooks for Fate's Folly.
 */
export function removeCustomHooks() {
    console.log("%cFate\'s Folly RollComplete Un-Set", `
        color:#D01B00;
        background-color:#A3A6B4;
        font-size:10pt;
        font-weight:bold;
        padding:5pt;
    `);
    Hooks.off("midi-qol.RollComplete", handleRollComplete);
}
