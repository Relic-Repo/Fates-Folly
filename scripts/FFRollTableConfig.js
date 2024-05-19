// FFRollTableConfig.js for "Fate's Folly"

export class FatesFollyRollTableConfig extends RollTableConfig {
    /**
     * Provides default options for the roll table configuration.
     * 
     * @override
     * @returns {Object} The default options merged with additional custom options.
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "modules/fates-folly/templates/ff-roll-table-config.hbs",
            classes: ["fates-folly", "sheet", "roll-table-config"],
            width: 800,
            height: "auto",
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]
        });
    }

    /**
     * Retrieves data for the roll table configuration.
     * 
     * @inheritdoc
     * @returns {Object} The data for the roll table configuration.
     */
    getData() {
        return super.getData();
    }

    /**
     * Activates listeners for the roll table configuration.
     * 
     * @inheritdoc
     * @param {jQuery} html - The jQuery HTML object.
     */
    activateListeners(html) {
        super.activateListeners(html);
    }

    /**
     * Updates the roll table configuration object.
     * 
     * @inheritdoc
     * @param {Event} event - The event object.
     * @param {Object} formData - The form data to update.
     * @returns {Promise} The promise resolving when the object is updated.
     */
    _updateObject(event, formData) {
        return super._updateObject(event, formData);
    }
}

/**
 * Registers the Fate's Folly roll table configuration.
 */
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

/**
 * Unregisters the Fate's Folly roll table configuration.
 */
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
