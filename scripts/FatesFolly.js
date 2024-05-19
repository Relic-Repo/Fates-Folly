// FatesFolly

export class FatesFolly {
    constructor(rollWorkflow) {
        this.rollWorkflow = rollWorkflow;
        this.resultDataMap = new Map();
        this.initializeEventListeners();
        this.processDrawTypes();
    }

    debugLog(message, style = "", additionalData = null) {
        const enableDebug = game.settings.get("fates-folly", "enableDebug");
        if (enableDebug) {
            console.log(`%c${message}`, style);
            if (additionalData !== null) {
                console.log(additionalData);
            }
        }
    }

    processDrawTypes() {
        this.drawingFunctionsMap = new Map([
            ['weapon', new Map([
                ['Piercing', this.drawWeaponPiercing.bind(this)],
                ['Slashing', this.drawWeaponSlashing.bind(this)],
                ['Bludgeoning', this.drawWeaponBludgeoning.bind(this)],
                ['default', this.drawWeapon.bind(this)]
            ])],
            ['spell', new Map([
                ['Acid', this.drawSpellAcid.bind(this)],
                ['Cold', this.drawSpellCold.bind(this)],
                ['Fire', this.drawSpellFire.bind(this)],
                ['Force', this.drawSpellForce.bind(this)],
                ['Lightning', this.drawSpellLightning.bind(this)],
                ['Necrotic', this.drawSpellNecrotic.bind(this)],
                ['Poison', this.drawSpellPoison.bind(this)],
                ['Psychic', this.drawSpellPsychic.bind(this)],
                ['Radiant', this.drawSpellRadiant.bind(this)],
                ['default', this.drawSpell.bind(this)]
            ])],
            ['feat', new Map([
                ['Piercing', this.drawWeaponPiercing.bind(this)],
                ['Slashing', this.drawWeaponSlashing.bind(this)],
                ['Bludgeoning', this.drawWeaponBludgeoning.bind(this)],
                ['default', this.drawFeat.bind(this)]
            ])]
        ]);
    }

    processRoll(isCritical, attackType, damageType) {
        try {
            const enableCriticals = game.settings.get("fates-folly", "enableCriticals");
            const enableFumbles = game.settings.get("fates-folly", "enableFumbles");
            this.debugLog(`Processing roll: Critical=${isCritical}, AttackType=${attackType}, DamageType=${damageType}`, `
                color: #D01B00;
                background-color: #A3A6B4;
                font-size:9pt;
                font-weight:bold;
                padding:1pt;
            `);
            this.debugLog(`Settings -> Criticals Enabled: ${enableCriticals}, Fumbles Enabled: ${enableFumbles}`, `
                color: #D01B00;
                background-color: #A3A6B4;
                font-size:9pt;
                font-weight:bold;
                padding:1pt;
            `);
            if (isCritical) {
                if (!enableCriticals) {
                    this.debugLog("Processing of critical is currently disabled.", `
                        color: #D01B00;
                        background-color: #A3A6B4;
                        font-size:9pt;
                        font-weight:bold;
                        padding:1pt;
                    `);
                    return;
                }
                this.processCritical(attackType, damageType);
            } else {
                if (!enableFumbles) {
                    this.debugLog("Processing of fumbles is currently disabled.", `
                        color: #D01B00;
                        background-color: #A3A6B4;
                        font-size:9pt;
                        font-weight:bold;
                        padding:1pt;
                    `);
                    return;
                }
                this.processFumble(attackType, damageType);
            }
        } catch (error) {
            console.error("Error in processRoll:", error);
            ui.notifications.error(`Error processing roll: ${error.message}`);
        }
    }
    
    processCritical(attackType, damageType) {
        try {
            const typeMap = this.drawingFunctionsMap.get(attackType);
            const drawFunction = typeMap?.get(damageType) || typeMap?.get('default');
            if (drawFunction) {
                this.debugLog(`Executing critical draw function for ${attackType}/${damageType}`, `
                    color: #D01B00;
                    background-color: #A3A6B4;
                    font-size:9pt;
                    font-weight:bold;
                    padding:1pt;
                `);
                drawFunction(true);
            } else {
                console.warn(`No function found for critical processing with type: ${attackType} and damage type: ${damageType}`);
            }
        } catch (error) {
            console.error(`Error processing critical hit for ${attackType}/${damageType}:`, error);
        }
    }

    
    processFumble(attackType, damageType) {
        try {
            const typeMap = this.drawingFunctionsMap.get(attackType);
            const drawFunction = typeMap?.get(damageType) || typeMap?.get('default');
            if (drawFunction) {
                this.debugLog(`Executing fumble draw function for ${attackType}/${damageType}`, `
                    color: #D01B00;
                    background-color: #A3A6B4;
                    font-size:9pt;
                    font-weight:bold;
                    padding:1pt;
                `);
                drawFunction(false);
            } else {
                console.warn(`No function found for fumble processing with type: ${attackType} and damage type: ${damageType}`);
            }
        } catch (error) {
            console.error(`Error processing fumble for ${attackType}/${damageType}:`, error);
        }
    }    

    async handleEffect(resultData, isCritical) {
        this.debugLog(`HandleEffect called with isCritical = ${isCritical}`, `
            color: #D01B00;
            background-color: #A3A6B4;
            font-size:9pt;
            font-weight: bold;
            padding: 1pt;
        `, resultData);
        try {
            const targetsArray = Array.from(this.rollWorkflow.targets);
            const targetToken = targetsArray.length > 0 ? targetsArray[0] : null;    
            const attackerToken = this.getTokenFromWorkflow('attackingToken');
    
            if (!attackerToken || !targetToken) {
                console.error("Required tokens are not available.");
                return;
            }    
            const baseDamageFormula = isCritical ?
                (Array.isArray(this.rollWorkflow.damageRolls) && this.rollWorkflow.damageRolls.length > 0 ?
                this.rollWorkflow.damageRolls[0]._formula : this.extractDamageFormula()) :
                this.extractDamageFormula();    
            for (const resultEntry of resultData) {
                try {
                    const { documentId: itemId, flags: { fatesFolly } } = resultEntry;
                    const { duration: rawDuration, attacker: attackerApplies, target: targetApplies, resultType, damageProcess } = fatesFolly;    
                    let damageAmount = await this.calculateEffect(damageProcess, baseDamageFormula, isCritical);
                    if (resultType === 'text') {
                        this.applyEffectsToTokens(damageAmount, attackerApplies ? attackerToken : null, targetApplies ? targetToken : null);
                    } else if (resultType === "item") {
                        this.applyItemsToTokens(itemId, rawDuration, attackerApplies ? attackerToken : null, targetApplies ? targetToken : null);
                    }
                } catch (error) {
                    console.error("Error processing result entry:", error);
                }
            }
        } catch (error) {
            console.error("Error in handleEffect:", error);
            ui.notifications.error(`Failed handleEffect: ${error.message}`);
        }
    } 
    
    getEffect(damageProcess) {
        const effectMap = new Map([
            ["none", async () => 0],
            ["max-dice", this.calculateMaxDamage.bind(this)],
            ["double-dice", this.calculateDoubleDiceDamage.bind(this)],
            ["max-double-dice", async (damageFormula) => (this.calculateMaxDamage(damageFormula)) * 2],
            ["max-triple-dice", async (damageFormula) => (this.calculateMaxDamage(damageFormula)) * 3],
            ["max-quadruple-dice", async (damageFormula) => (this.calculateMaxDamage(damageFormula)) * 4],
            ["weapon", (damageFormula) => new Roll(damageFormula).evaluate({async: true}).then(r => r.total)],
            ["half-weapon", (damageFormula) => new Roll(damageFormula).evaluate({async: true}).then(r => r.total / 2)],
            ["double-weapon", (damageFormula) => new Roll(damageFormula).evaluate({async: true}).then(r => r.total * 2)],
        ]);
        return effectMap.get(damageProcess) || (async () => 0);
    }

    convertDuration(rawDuration) {
        this.debugLog(`Converting rawDuration: ${rawDuration}`, `
            color: #D01B00;
            background-color: #A3A6B4;
            font-size:9pt;
            font-weight:bold;
            padding:1pt;
        `);
        if (typeof rawDuration !== 'string') {
            console.error("Invalid rawDuration:", rawDuration);
            return {};
        }        
        if (rawDuration.toLowerCase() === 'manual' || rawDuration.toLowerCase() === 'none') {
            return { seconds: 99999 };
        }    
        const timePatterns = {
            days: { regex: /\b(\d+)\s*days?\b/i, multiplier: 86400 },
            hours: { regex: /\b(\d+)\s*hours?\b/i, multiplier: 3600 },
            minutes: { regex: /\b(\d+)\s*minutes?\b/i, multiplier: 60 },
            seconds: { regex: /\b(\d+)\s*seconds?\b/i, multiplier: 1 },
            rounds: { regex: /\b(\d+)\s*rounds?\b/i },
            turns: { regex: /\b(\d+)\s*turns?\b/i },
        };    
        let duration = {};
        let specialUnitsSet = false;    
        Object.entries(timePatterns).forEach(([unit, {regex, multiplier}]) => {
            const match = rawDuration.match(regex);
            if (match) {
                const value = parseInt(match[1], 10);
                if (multiplier) {
                    duration.seconds = (duration.seconds || 0) + (value * multiplier);
                } else {
                    duration[unit] = value;
                    specialUnitsSet = true;
                }
            }
        });
        if (specialUnitsSet && 'seconds' in duration) {
            delete duration.seconds;
        }    
        this.debugLog(`Converted Duration:`, `
            color: #D01B00;
            background-color: #A3A6B4;
            font-size:9pt;
            font-weight: bold;
            padding: 1pt;
        `, duration);

        return duration;
    }    

    findTableResults(resultDataIds) {
        const results = [];
        for (let id of resultDataIds) {
            for (let table of game.tables.contents) {
                const result = table.results.find(r => r.id === id);
                if (result) {
                    results.push(result.toObject());
                    break;
                }
            }
        }
        if (results.length === 0) {
            console.error("No TableResults found:", resultDataIds);
        }
        return results;
    }

    tableDrawListener(isCritical, isFumble) {
        Hooks.once("renderChatMessage", async (message) => {
            if (!game.user.isGM) return;
            const content = $(message.content);
            const resultDataIds = content.find(".table-result").map((_, el) => $(el).data("result-id")).get();
            this.debugLog("Extracted Result IDs:", `
                color: #D01B00;
                background-color: #A3A6B4;
                font-size:9pt;
                font-weight: bold;
                padding: 1pt;
            `, resultDataIds);
            const results = this.findTableResults(resultDataIds);
            this.debugLog("Table Results Data:", `
                color: #D01B00;
                background-color: #A3A6B4;
                font-size:9pt;
                font-weight: bold;
                padding: 1pt;
            `, results);
            if (isCritical || isFumble) {
                this.createChatButton(results, isCritical);
            }
        });
    }

    createChatButton(results, isCritical) {
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.resultDataMap.set(uniqueId, results);
        this.debugLog(`Chat Button Creation - UniqueId: ${uniqueId}, isCritical: ${isCritical}`, `
            color: #D01B00;
            background-color: #A3A6B4;
            font-size:9pt;
            font-weight:bold;
            padding:1pt;
        `);
        const buttonTitle = isCritical ? "Apply Critical Effect" : "Apply Fumble Effect";
        const messageContent = `
            <div>
                <p>${buttonTitle}</p>
                <button class="fates-folly-button" data-is-critical="${isCritical}" data-result-id="${uniqueId}">${buttonTitle}</button>
            </div>
        `;
        ChatMessage.create({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker(),
            content: messageContent,
            whisper: ChatMessage.getWhisperRecipients("GM").map(u => u.id)
        });
    }

    initializeEventListeners() {
        $(document).off("click.fatesFolly").on("click.fatesFolly", ".fates-folly-button", async (event) => {
            event.preventDefault();
            const button = $(event.currentTarget);
            const isCriticalString = button.data("is-critical").toString().trim(); // Ensure it's a string and trim whitespace
            const isCritical = (isCriticalString === "true");
            const resultDataId = button.data("result-id");
            const resultData = this.resultDataMap.get(resultDataId);
            if (!resultData) {
                console.error("Result data not found:", resultDataId);
                return;
            }
            await this.handleEffect(resultData, isCritical);
            button.prop('disabled', true).text('Effect Applied');
        });
    }

    getTokenFromWorkflow(key) {
        const keys = key.split('.');
        let currentObject = this.rollWorkflow;
        for (let k of keys) {
            if (k.includes('[')) {
                const match = k.match(/(\w+)\[(\d+)\]/);
                if (match) {
                    const arrayKey = match[1];
                    const arrayIndex = parseInt(match[2], 10);
                    currentObject = currentObject[arrayKey][arrayIndex];
                }
            } else {
                currentObject = currentObject[k];
            }
            if (currentObject === undefined) {
                console.error(`Token path ${key} not found or has no actor.`);
                return null;
            }
        }
        const tokenId = currentObject.id;
        const token = canvas.tokens.get(tokenId);
        if (!token || !token.actor) {
            console.error(`Token with ID ${tokenId} not found or has no actor.`);
            return null;
        }
        return token;
    }   

    extractDamageFormula() {
        return this.rollWorkflow.item.labels.damage.match(/(\d+d\d+)/)?.[0] || "0";
    }

    async calculateEffect(damageProcess, baseDamageFormula, isCritical) {
        const effectFn = this.getEffect(damageProcess);
        const preProcessDamage = isCritical ? this.rollWorkflow.damageTotal : 0;
        try {
            const damage = await effectFn(baseDamageFormula);
            const adjustedDamage = Math.max(damage - preProcessDamage, 0);
            return adjustedDamage;
        } catch (error) {
            console.error("Error calculating effect:", error);
            return 0;
        }
    }
    

    applyHpAdjustment(token, damage) {
        try {
            const hpPath = "system.attributes.hp.value";
            const tempHpPath = "system.attributes.hp.temp";
            let currentHp = getProperty(token.actor, hpPath);
            let currentTempHp = getProperty(token.actor, tempHpPath) || 0;    
            this.debugLog(`Current HP: ${currentHp}, Current Temp HP: ${currentTempHp}`, `
                color: #D01B00;
                background-color: #A3A6B4;
                font-size:9pt;
                font-weight:bold;
                padding:1pt;
            `);
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
            this.debugLog(`New HP: ${newHp}, New Temp HP: ${newTempHp}`, `
                color: #D01B00;
                background-color: #A3A6B4;
                font-size:9pt;
                font-weight:bold;
                padding:1pt;
            `);
            token.actor.update({ [tempHpPath]: newTempHp, [hpPath]: newHp });
            this.debugLog("Actor updated successfully.", `
                color: #D01B00;
                background-color: #A3A6B4;
                font-size:9pt;
                font-weight:bold;
                padding:1pt;
            `);
    
        } catch (error) {
            console.error(`Error applying ${adjustmentType}:`, error);
            ui.notifications.error(`Failed to apply ${adjustmentType}: ${error.message}`);
        }
    }

    async wait(ms) { 
        return new Promise(resolve => { setTimeout(resolve, ms);
        }); 
    }

    async applyEffectsToTokens(damageAmount, ...tokens) {
        tokens.forEach(async token => {
            if (token) {
                    this.applyHpAdjustment(token, damageAmount);
                    await this.wait(500);
                    this.sendDamageReport(token, damageAmount);                    
                    this.debugLog(`Effect applied to ${token.name}. Damage Amount: ${damageAmount}`, `
                        color: #D01B00;
                        background-color: #A3A6B4;
                        font-size:9pt;
                        font-weight:bold;
                        padding:1pt;
                    `);

            }
        });
    }

    sendDamageReport(token, damage) {
        const messageContent = `
            <div class="chat-message fates-folly">
                <strong>${token.name}</strong> took <strong>${damage}</strong> additional damage.
            </div>
        `;
        ChatMessage.create({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ token }),
            content: messageContent,
            type: CONST.CHAT_MESSAGE_TYPES.OTHER
        });
    }

    async findItem(searchKey) {
        let item = await game.items.get(searchKey);
        if (item) return item;
        item = await game.items.find(i => i.name === searchKey);
        return item;
    }

    extractActorItemUuid(fullUuid) {
        const regex = /Actor\.\w+\.Item\.\w+/;
        const match = fullUuid.match(regex);
        return match ? match[0] : "";
    }  

    applyDaeEffect(rawDuration, itemUuid) {
        const itemIdentifier = itemUuid.match(/Item\.\w+/)[0];
        const truncUuid = this.extractActorItemUuid(itemUuid);    
        const duration = this.convertDuration(rawDuration);
        return [
            {
                name: `Item Remove: ${itemIdentifier}`,
                transfer: false,
                changes: [{
                    key: "flags.dae.deleteUuid",
                    value: itemUuid,
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    priority: 20
                }],
                icon: 'modules/fates-folly/img/items/remove.png', 
                origin: `Item.${truncUuid}`,
                duration: {
                    ...duration,
                    startTime: game.time.worldTime,
                    startRound: game.combat?.round
                },
                "flags.dae.stackable": false,
                description: `Fate's Folly Item Remover for ${itemIdentifier}`,
            }
        ];
    } 
   
    async applyItemsToTokens(itemId, rawDuration, ...tokens) {
        const systemItem = await this.findItem(itemId);
        if (!systemItem) {
            this.debugLog(`Item not found for ID: ${itemId}`, `
                color: #D01B00;
                background-color: #A3A6B4;
                font-size:9pt;
                font-weight:bold;
                padding:1pt;
            `);
            return;
        }
        let itemData = duplicate(systemItem.data);
        for (const token of tokens) {
            if (!token) continue;
            const addedItem = await token.actor.createEmbeddedDocuments("Item", [itemData]);
            const addedItemId = addedItem[0].id;
            const addedItemUuid = addedItem[0].uuid;
            this.debugLog(`Added item to ${token.name}. Item ID: ${addedItemId}`, `
                color: #D01B00;
                background-color: #A3A6B4;
                font-size:9pt;
                font-weight:bold;
                padding:1pt;
            `);
            const effects = this.applyDaeEffect(rawDuration, addedItemUuid);
            await this.applyItemById(token, addedItemId, effects);
        }
    }

    async applyItemById(token, itemId, effects) {
        const item = token.actor.items.get(itemId);
        if (item) {
            await token.actor.createEmbeddedDocuments("ActiveEffect", effects);
            this.debugLog(`Applied effects to ${token.name} for item ID: ${itemId}`, `
                color: #D01B00;
                background-color: #A3A6B4;
                font-size:9pt;
                font-weight: bold;
                padding: 1pt;
            `, effects);
            this.debugLog(`**** The End ****`, `
                color: #D01B00;
                background-color: #A3A6B4;
                font-size:9pt;
                font-weight: bold;
                padding: 1pt;
            `);
        } else {
            this.debugLog(`Could not find item with ID ${itemId} on the actor.`, `
                color: #D01B00;
                background-color: #A3A6B4;
                font-size:9pt;
                font-weight: bold;
                padding: 1pt;
            `);
        }
    }

    calculateMaxDamage(damageFormula) {
        try{
            const diceRollRegex = /(\d+)d(\d+)/g;
            const numericModifierRegex = /\+\s*(\d+)/g;
            let maxResult = 0;
            let diceRollMatch;
            while ((diceRollMatch = diceRollRegex.exec(damageFormula)) !== null) {
                const [_, numDice, diceType] = diceRollMatch;
                const diceMax = parseInt(numDice, 10) * parseInt(diceType, 10);
                maxResult += diceMax;
            }
            let numericModifierMatch;
            while ((numericModifierMatch = numericModifierRegex.exec(damageFormula)) !== null) {
                const [_, modifier] = numericModifierMatch;
                maxResult += parseInt(modifier, 10);
            }
            return maxResult;
        } catch (error){
            console.error("Error calculateMaxDamage:", error);
            ui.notifications.error(`Failed calculateMaxDamage: ${error.message}`);
        }
    }

    async calculateDoubleDiceDamage(damageFormula) {
        try{
            let roll = new Roll(damageFormula);
            roll.alter(2, 0);
            await roll.evaluate({async: true});
            return roll.total;
        } catch (error){
            console.error("Error calculateDoubleDiceDamage:", error);
            ui.notifications.error(`Failed calculateDoubleDiceDamage: ${error.message}`);
        }
    }

    async drawWeapon(critState) {
        try {
            let tableName = critState ? "Weapon Critical" : "Weapon Fumble";
            let table = game.tables.find(t => t.name === tableName);
            if (!table) {
                console.warn(`Table "${tableName}" not found.`);
                return;
            }
            table.draw();
        } catch (error) {
            console.error("***Error*** \n in drawWeapon:", error);
        }
    }

    async drawWeaponPiercing(critState) {
        try {
            let tableName = critState ? "Piercing Critical" : "Piercing Fumble";
            let table = game.tables.find(t => t.name === tableName);
            if (!table) {
                console.log(`Table "${tableName}" not found.`);
                return;
            }
            table.draw();
        } catch (error) {
            console.error("***Error*** \n in drawWeaponPiercing", error);
        }
    }

    async drawWeaponSlashing(critState) {
        try {
            let tableName = critState ? "Slashing Critical" : "Slashing Fumble";
            let table = game.tables.find(t => t.name === tableName);
            if (!table) {
                console.log(`Table "${tableName}" not found.`);
                return;
            }
            table.draw();
        } catch (error) {
            console.error("***Error*** \n in drawWeaponSlashing", error);
        }
    }

    async drawWeaponBludgeoning(critState) {
        try {
            let tableName = critState ? "Bludgeoning Critical" : "Bludgeoning Fumble";
            let table = game.tables.find(t => t.name === tableName);
            if (!table) {
                console.log(`Table "${tableName}" not found.`);
                return;
            }
            table.draw();
        } catch (error) {
            console.error("***Error*** \n in drawWeaponSlashing", error);
        }
    }        
    async drawSpell(critState, fumbState) {
        try {
            let table = null;
            if (critState) table = game.tables.getName("Spell Critical");
            else table = game.tables.getName("Spell Fumble");
            if (!table) return;
            const currentRollMode = game.settings.get('core', 'rollMode');
            table.draw({ rollMode: currentRollMode, });
        } catch (error) {
            console.error("****Error**** \n in drawSpell:", error);
        }
    }    
    async drawFeat(critState, fumbState) {
        try {
            let table = null;
            if (critState) table = game.tables.getName("Feat Criticals");
            else table = game.tables.getName("Feat Fumbles");
            if (!table) return;
            const currentRollMode = game.settings.get('core', 'rollMode');
            table.draw({ rollMode: currentRollMode, });
        } catch (error) {
            console.error("****Error**** \n in drawFeat:", error);
        }
    }
    async drawSpellAcid(critState, fumbState) {
        try {
            let table = null;
            if (critState) table = game.tables.getName("Acid Critical");
            else table = game.tables.getName("Acid Fumble");
            if (!table) return;
            const currentRollMode = game.settings.get('core', 'rollMode');
            table.draw({ rollMode: currentRollMode, });
        } catch (error) {
            console.error("****Error**** \n in drawSpellAcid:", error);
        }
    }    
    async drawSpellCold(critState, fumbState) {
        try {
            let table = null;
            if (critState) table = game.tables.getName("Cold Critical");
            else table = game.tables.getName("Cold Fumble");
            if (!table) return;
            const currentRollMode = game.settings.get('core', 'rollMode');
            table.draw({ rollMode: currentRollMode, });
        } catch (error) {
            console.error("****Error**** \n in drawSpellCold:", error);
        }
    }    
    async drawSpellFire(critState, fumbState) {
        try {
            let table = null;
            if (critState) table = game.tables.getName("Fire Critical");
            else table = game.tables.getName("Fire Fumble");
            if (!table) return;
            const currentRollMode = game.settings.get('core', 'rollMode');
            table.draw({ rollMode: currentRollMode, });
        } catch (error) {
            console.error("****Error**** \n in drawSpellFire:", error);
        }
    }    
    async drawSpellForce(critState, fumbState) {
        try {
            let table = null;
            if (critState) table = game.tables.getName("Force Critical");
            else table = game.tables.getName("Force Fumble");
            if (!table) return;
            const currentRollMode = game.settings.get('core', 'rollMode');
            table.draw({ rollMode: currentRollMode, });
        } catch (error) {
            console.error("****Error**** \n in drawSpellForce:", error);
        }
    }    
    async drawSpellLightning(critState, fumbState) {
        try {
            let table = null;
            if (critState) table = game.tables.getName("Lightning Critical");
            else table = game.tables.getName("Lightning Fumble");
            if (!table) return;
            const currentRollMode = game.settings.get('core', 'rollMode');
            table.draw({ rollMode: currentRollMode, });
        } catch (error) {
            console.error("****Error**** \n in drawSpellLightning:", error);
        }
    }    
    async drawSpellNecrotic(critState, fumbState) {
        try {
            let table = null;
            if (critState) table = game.tables.getName("Necrotic Critical");
            else table = game.tables.getName("Necrotic Fumble");
            if (!table) return;
            const currentRollMode = game.settings.get('core', 'rollMode');
            table.draw({ rollMode: currentRollMode, });
        } catch (error) {
            console.error("****Error**** \n in drawSpellNecrotic:", error);
        }
    }    
    async drawSpellPoison(critState, fumbState) {
        try {
            let table = null;
            if (critState) table = game.tables.getName("Poison Critical");
            else table = game.tables.getName("Poison Fumble");
            if (!table) return;
            const currentRollMode = game.settings.get('core', 'rollMode');
            table.draw({ rollMode: currentRollMode, });
        } catch (error) {
            console.error("****Error**** \n in drawSpellPoison:", error);
        }
    }    
    async drawSpellPsychic(critState, fumbState) {
        try {
            let table = null;
            if (critState) table = game.tables.getName("Psychic Critical");
            else table = game.tables.getName("Psychic Fumble");
            if (!table) return;
            const currentRollMode = game.settings.get('core', 'rollMode');
            table.draw({ rollMode: currentRollMode, });
        } catch (error) {
            console.error("****Error**** \n in drawSpellPsychic:", error);
        }
    }    
    async drawSpellRadiant(critState, fumbState) {
        try {
            let table = null;
            if (critState) table = game.tables.getName("Radiant Critical");
            else table = game.tables.getName("Radiant Fumble");
            if (!table) return;
            const currentRollMode = game.settings.get('core', 'rollMode');
            table.draw({ rollMode: currentRollMode, });
        } catch (error) {
            console.error("****Error**** \n in drawSpellRadiant:", error);
        }
    }
}