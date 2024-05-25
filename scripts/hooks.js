// hooks.js for "Fate's Folly"

import { FatesFolly } from "./FatesFolly.js";
import { debugLog } from "./utils.js";

let workflowState = { isWorkflowInProgress: false }; // Use an object to manage the state
const styling = `
            color:#D01B00;
            background-color:#A3A6B4;
            font-size:9pt;
            font-weight:bold;
            padding:1pt;
        `;


/**
 * Handles the completion of a roll workflow.
 * 
 * @param {Object} workflow - The roll workflow object.
 */
async function handleRollComplete(workflow) {
    if (workflowState.isWorkflowInProgress) {
        debugLog("Fate\'s Folly - Third Party \n     RollComplete Hook DETECTED!!      \n     **** Workflow in Progress ****    ", styling, workflow);
        return; 
    }

    debugLog("Fate\'s Folly RollComplete Hook \n **** The Beginning ****", styling, workflow);

    workflowState.isWorkflowInProgress = true; // Set flag to indicate workflow processing has started

    if (!workflow.isCritical && !workflow.isFumble)
        workflowState.isWorkflowInProgress = false;

    let fatesFolly = new FatesFolly(workflow);
    if (workflow.isCritical || workflow.isFumble) {
        await fatesFolly.tableDrawListener(workflow.isCritical, workflow.isFumble);
        await fatesFolly.processRoll(workflow.isCritical, workflow.item.type, workflow.item.labels.damageTypes);
    }
}

/**
 * Sets up hooks for Fate's Folly.
 */
export function setupHooks() {
    debugLog("Fate\'s Folly RollComplete Set", styling);
    Hooks.on("midi-qol.RollComplete", handleRollComplete);
}

/**
 * Removes custom hooks for Fate's Folly.
 */
export function removeCustomHooks() {
    debugLog("Fate\'s Folly RollComplete Un-Set", styling);
    Hooks.off("midi-qol.RollComplete", handleRollComplete);
}

export { workflowState }; // Ensure the state is exported correctly
