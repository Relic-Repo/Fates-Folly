// Apply Overtime Effect
console.log("Received args:", args);
/**
 * This macro gets executed as part of an Overtime effect.
 * It asks the user if they want to apply damage, and applies it if confirmed.
 * It is intended for use for those that do not use the Midi setting of Auto Apply Damage
 * Add macro=nonAutoOvertime after rollMode=publicroll,
 * When using this do not apply damage via Midi's damage card
 * Use the dialog this provides
 */
if (game.user.isGM) {
    const damage = args[0]?.damageRoll?.total || 0;
    const damageType = args[0]?.damageRoll?.options?.type || "undefined";
    console.log("Damage:", damage, "Damage Type:", damageType);
    if (!damage || damageType === "undefined") {
    console.error("Invalid damage or damage type");
    return;
    }
    const token = canvas.tokens.get(args[0]?.tokenId);
    if (!token) {
    console.error("Token not found");
    return;
    }
    new Dialog({
        title: `Apply Overtime Damage`,
        content: `
        <style>
            .custom-dialog .dialog-content { background: #222; color: #f8f8f8; padding: 20px; border-radius: 8px; }
            .custom-dialog .dialog-buttons { background: #333; padding: 10px; border-top: 2px solid #444; }
            .custom-dialog .dialog-button { background: #555; color: #222; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; font-size: 16px; }
            .custom-dialog .dialog-button:hover { background: #666; }
        </style>
        <div class="dialog-content">
            <p style="font-size: 20px;">Do you want to apply <strong>${damage}</strong> <span style="color: #FF6347;">${damageType}</span> damage to <strong>${token.name}</strong>?</p>
        </div>
        `,
        buttons: {
        yes: {
            icon: '<i class="fas fa-check-circle"></i>',
            label: "Yes",
            callback: () => applyHpAdjustment(token, damage),
            class: "dialog-button"
        },
        no: {
            icon: '<i class="fas fa-times-circle"></i>',
            label: "No",
            class: "dialog-button"
        }
        },
        default: "no",
        render: html => html.addClass("custom-dialog")
    }).render(true);

    function applyHpAdjustment(token, damage) {
    try {
        const hpPath = "system.attributes.hp.value";
        const tempHpPath = "system.attributes.hp.temp";
        let currentHp = getProperty(token.actor, hpPath);
        let currentTempHp = getProperty(token.actor, tempHpPath) || 0;
        console.log(`Current HP: ${currentHp}, Current Temp HP: ${currentTempHp}`);
        let newHp = currentHp;
        let newTempHp = currentTempHp;
        if (damage > 0) {
        if (currentTempHp > 0) {
            const tempHpAfterDamage = Math.max(currentTempHp - Math.round(damage), 0);
            damage -= (currentTempHp - tempHpAfterDamage);
            newTempHp = tempHpAfterDamage;
        }
        newHp = Math.max(currentHp - Math.round(damage), 0);
        } else {
        const maxHp = getProperty(token.actor, "system.attributes.hp.max");
        newHp = Math.min(currentHp + Math.abs(Math.round(damage)), maxHp);
        }
        console.log(`New HP: ${newHp}, New Temp HP: ${newTempHp}`);
        token.actor.update({ [tempHpPath]: newTempHp, [hpPath]: newHp });
        console.log("Actor updated successfully.");
    } catch (error) {
        console.error(`Error applying damage:`, error);
        ui.notifications.error(`Failed to apply damage: ${error.message}`);
    }
    }
}
