// hooks.js

import { FatesFolly } from "./FatesFolly.js";

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


