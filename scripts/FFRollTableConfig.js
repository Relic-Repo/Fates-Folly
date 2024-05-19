// FFRollTableConfig.js

export class FatesFollyRollTableConfig extends RollTableConfig {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "modules/fates-folly/templates/ff-roll-table-config.hbs",
            classes: ["fates-folly", "sheet", "roll-table-config"],
            width: 800,
            height: "auto",
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]

        });
    }
    
    /** @inheritdoc */
    getData() {
        return super.getData();
    }

    /** @inheritdoc */
    activateListeners(html) {
        super.activateListeners(html);
    }

    /** @inheritdoc */
    _updateObject(event, formData) {
        return super._updateObject(event, formData);
    }
}


export function registerFatesFollyRollTable() {    
        DocumentSheetConfig.registerSheet(RollTable, "fates-folly", FatesFollyRollTableConfig, {
            label: "Fate's Folly Table",
            makeDefault: false
        });
        console.log("%cFate\'s Folly Roll Table registered.", `
        color:#D01B00;
        background-color:#A3A6B4;
        font-size:10pt;
        font-weight:bold;
        padding:5pt;
        `);
        
    
}
export function unregisterFatesFollyRollTable() {
    const sheet = DocumentSheetConfig._registeredSheets.RollTable["fates-folly"];
    if (sheet) {
        DocumentSheetConfig.unregisterSheet(RollTable, "fates-folly", FatesFollyRollTableConfig);
        console.log("%cFate\'s Folly Roll Table unregistered.", `
        color:#D01B00;
        background-color:#A3A6B4;
        font-size:10pt;
        font-weight:bold;
        padding:5pt;
        `);
    } else {
        console.log("%cFate\'s Folly Roll Table was not registered.", `
        color:#D01B00;
        background-color:#A3A6B4;
        font-size:10pt;
        font-weight:bold;
        padding:5pt;
        `);
    }
}
