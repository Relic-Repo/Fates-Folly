async function recreateRollTableEntries(rollTableId) {
    const rollTable = game.tables.get(rollTableId);
    if (!rollTable) {
        ui.notifications.error("Roll Table not found");
        return;
    }
    const newEntries = rollTable.results.map(result => ({
        ...result.data,
        _id: foundry.utils.randomID(16)
    }));

    try {
        await rollTable.deleteEmbeddedDocuments("TableResult", rollTable.results.map(r => r._id));
        await rollTable.createEmbeddedDocuments("TableResult", newEntries);
        ui.notifications.info(`Roll Table '${rollTable.name}' entries successfully recreated with new IDs.`);
    } catch (error) {
        console.error("Failed to recreate Roll Table entries: ", error);
        ui.notifications.error("Failed to recreate Roll Table entries. Check console for details.");
    }
}

function promptForRollTableID() {
    let dialogContent = `<form>
        <div class="form-group">
            <label>Enter the Roll Table ID:</label>
            <input type="text" name="rollTableId" placeholder="Roll Table ID" required>
        </div>
    </form>`;

    let d = new Dialog({
        title: "Recreate Roll Table Entry IDs",
        content: dialogContent,
        buttons: {
            recreate: {
                icon: '<i class="fas fa-sync"></i>',
                label: "Recreate",
                callback: (html) => {
                    const rollTableId = html.find('input[name="rollTableId"]').val();
                    if (rollTableId) {
                        recreateRollTableEntries(rollTableId);
                    } else {
                        ui.notifications.error("You must enter a Roll Table ID.");
                    }
                }
            }
        },
        default: "recreate",
        close: () => console.log("Dialog closed")
    });
    d.render(true);
}

promptForRollTableID();
