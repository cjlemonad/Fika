"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InraidControllerExtension = void 0;
const ApplicationContext_1 = require("C:/snapshot/project/obj/context/ApplicationContext");
const InraidController_1 = require("C:/snapshot/project/obj/controllers/InraidController");
const PlayerScavGenerator_1 = require("C:/snapshot/project/obj/generators/PlayerScavGenerator");
const HealthHelper_1 = require("C:/snapshot/project/obj/helpers/HealthHelper");
const InRaidHelper_1 = require("C:/snapshot/project/obj/helpers/InRaidHelper");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const NotificationSendHelper_1 = require("C:/snapshot/project/obj/helpers/NotificationSendHelper");
const ProfileHelper_1 = require("C:/snapshot/project/obj/helpers/ProfileHelper");
const QuestHelper_1 = require("C:/snapshot/project/obj/helpers/QuestHelper");
const TraderHelper_1 = require("C:/snapshot/project/obj/helpers/TraderHelper");
const ItemTpl_1 = require("C:/snapshot/project/obj/models/enums/ItemTpl");
const QuestStatus_1 = require("C:/snapshot/project/obj/models/enums/QuestStatus");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const SaveServer_1 = require("C:/snapshot/project/obj/servers/SaveServer");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const InsuranceService_1 = require("C:/snapshot/project/obj/services/InsuranceService");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
const MailSendService_1 = require("C:/snapshot/project/obj/services/MailSendService");
const MatchBotDetailsCacheService_1 = require("C:/snapshot/project/obj/services/MatchBotDetailsCacheService");
const PmcChatResponseService_1 = require("C:/snapshot/project/obj/services/PmcChatResponseService");
const TraderServicesService_1 = require("C:/snapshot/project/obj/services/TraderServicesService");
const JsonUtil_1 = require("C:/snapshot/project/obj/utils/JsonUtil");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const TimeUtil_1 = require("C:/snapshot/project/obj/utils/TimeUtil");
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
let InraidControllerExtension = class InraidControllerExtension extends InraidController_1.InraidController {
    logger;
    saveServer;
    jsonUtil;
    timeUtil;
    databaseService;
    traderServicesService;
    localisationService;
    pmcChatResponseService;
    matchBotDetailsCacheService;
    questHelper;
    itemHelper;
    profileHelper;
    playerScavGenerator;
    notificationSendHelper;
    healthHelper;
    traderHelper;
    insuranceService;
    inRaidHelper;
    applicationContext;
    configServer;
    mailSendService;
    config = require("../config/config.json");
    constructor(logger, saveServer, jsonUtil, timeUtil, databaseService, traderServicesService, localisationService, pmcChatResponseService, matchBotDetailsCacheService, questHelper, itemHelper, profileHelper, playerScavGenerator, notificationSendHelper, healthHelper, traderHelper, insuranceService, inRaidHelper, applicationContext, configServer, mailSendService, randomUtil) {
        super(logger, saveServer, timeUtil, databaseService, pmcChatResponseService, matchBotDetailsCacheService, questHelper, itemHelper, profileHelper, playerScavGenerator, healthHelper, traderHelper, traderServicesService, localisationService, insuranceService, inRaidHelper, applicationContext, configServer, mailSendService, randomUtil);
        this.logger = logger;
        this.saveServer = saveServer;
        this.jsonUtil = jsonUtil;
        this.timeUtil = timeUtil;
        this.databaseService = databaseService;
        this.traderServicesService = traderServicesService;
        this.localisationService = localisationService;
        this.pmcChatResponseService = pmcChatResponseService;
        this.matchBotDetailsCacheService = matchBotDetailsCacheService;
        this.questHelper = questHelper;
        this.itemHelper = itemHelper;
        this.profileHelper = profileHelper;
        this.playerScavGenerator = playerScavGenerator;
        this.notificationSendHelper = notificationSendHelper;
        this.healthHelper = healthHelper;
        this.traderHelper = traderHelper;
        this.insuranceService = insuranceService;
        this.inRaidHelper = inRaidHelper;
        this.applicationContext = applicationContext;
        this.configServer = configServer;
        this.mailSendService = mailSendService;
    }
    /**
     * Handle updating player profile post-pmc raid
     * @param sessionID Session id
     * @param postRaidRequest Post-raid data
     */
    savePmcProgress(sessionID, postRaidRequest) {
        const serverProfile = this.saveServer.getProfile(sessionID);
        const locationName = serverProfile.inraid.location.toLowerCase();
        const map = this.databaseService.getLocation(locationName).base;
        const serverPmcProfile = serverProfile.characters.pmc;
        const serverScavProfile = serverProfile.characters.scav;
        const isDead = this.isPlayerDead(postRaidRequest.exit);
        const preRaidGear = this.inRaidHelper.getPlayerGear(serverPmcProfile.Inventory.items);
        serverProfile.inraid.character = "pmc";
        this.inRaidHelper.updateProfileBaseStats(serverPmcProfile, postRaidRequest, sessionID);
        this.inRaidHelper.updatePmcProfileDataPostRaid(serverPmcProfile, postRaidRequest, sessionID);
        this.mergePmcAndScavEncyclopedias(serverPmcProfile, serverScavProfile);
        // Check for exit status
        this.markOrRemoveFoundInRaidItems(postRaidRequest);
        postRaidRequest.profile.Inventory.items = this.itemHelper.replaceIDs(postRaidRequest.profile.Inventory.items, postRaidRequest.profile, serverPmcProfile.InsuredItems, postRaidRequest.profile.Inventory.fastPanel);
        this.inRaidHelper.addStackCountToMoneyFromRaid(postRaidRequest.profile.Inventory.items);
        // Purge profile of equipment/container items
        this.inRaidHelper.setInventory(sessionID, serverPmcProfile, postRaidRequest.profile);
        this.healthHelper.saveVitality(serverPmcProfile, postRaidRequest.health, sessionID);
        // Get array of insured items+child that were lost in raid
        const gearToStore = this.insuranceService.getGearLostInRaid(serverPmcProfile, postRaidRequest, preRaidGear, sessionID, false);
        // Check if insurance fraud is allowed
        if (gearToStore.length > 0 && this.config.EnableDefaultInsurance) {
            this.insuranceService.storeGearLostInRaidToSendLater(sessionID, gearToStore);
        }
        // Edge case - Handle usec players leaving lighthouse with Rogues angry at them
        if (locationName === "lighthouse" && postRaidRequest.profile.Info.Side.toLowerCase() === "usec") {
            // Decrement counter if it exists, don't go below 0
            const remainingCounter = serverPmcProfile?.Stats.Eft.OverallCounters.Items.find((x) => x.Key.includes("UsecRaidRemainKills"));
            if (remainingCounter?.Value > 0) {
                remainingCounter.Value--;
            }
        }
        if (isDead) {
            this.pmcChatResponseService.sendKillerResponse(sessionID, serverPmcProfile, postRaidRequest.profile.Stats.Eft.Aggressor);
            this.matchBotDetailsCacheService.clearCache();
            this.performPostRaidActionsWhenDead(postRaidRequest, serverPmcProfile, sessionID);
        }
        else {
            // Not dead
            // Check for cultist amulets in special slot (only slot it can fit)
            const sacredAmulet = this.itemHelper.getItemFromPoolByTpl(serverPmcProfile.Inventory.items, ItemTpl_1.ItemTpl.CULTISTAMULET_SACRED_AMULET, "SpecialSlot");
            if (sacredAmulet) {
                // No charges left, delete it
                if (sacredAmulet.upd.CultistAmulet.NumberOfUsages <= 0) {
                    serverPmcProfile.Inventory.items.splice(serverPmcProfile.Inventory.items.indexOf(sacredAmulet), 1);
                }
                else if (sacredAmulet.upd.CultistAmulet.NumberOfUsages > 0) {
                    // Charges left, reduce by 1
                    sacredAmulet.upd.CultistAmulet.NumberOfUsages--;
                }
            }
        }
        const victims = postRaidRequest.profile.Stats.Eft.Victims.filter((victim) => ["pmcbear", "pmcusec"].includes(victim.Role.toLowerCase()));
        if (victims?.length > 0) {
            this.pmcChatResponseService.sendVictimResponse(sessionID, victims, serverPmcProfile);
        }
        this.insuranceService.sendInsuredItems(serverPmcProfile, sessionID, map.Id);
    }
    /**
     * Make changes to PMC profile after they've died in raid,
     * Alter body part hp, handle insurance, delete inventory items, remove carried quest items
     * @param postRaidSaveRequest Post-raid save request
     * @param pmcData Pmc profile
     * @param sessionID Session id
     * @returns Updated profile object
     */
    performPostRaidActionsWhenDead(postRaidSaveRequest, pmcData, sessionID) {
        this.updatePmcHealthPostRaid(postRaidSaveRequest, pmcData);
        // replaced this
        // this.inRaidHelper.deleteInventory(pmcData, sessionID);
        this.deleteInventoryWithoutInsuranceItems(pmcData, sessionID);
        if (this.inRaidHelper.shouldQuestItemsBeRemovedOnDeath()) {
            // Find and remove the completed condition from profile if player died, otherwise quest is stuck in limbo
            // and quest items cannot be picked up again
            const allQuests = this.questHelper.getQuestsFromDb();
            const activeQuestIdsInProfile = pmcData.Quests.filter((profileQuest) => ![QuestStatus_1.QuestStatus.AvailableForStart, QuestStatus_1.QuestStatus.Success, QuestStatus_1.QuestStatus.Expired].includes(profileQuest.status)).map((x) => x.qid);
            for (const questItem of postRaidSaveRequest.profile.Stats.Eft.CarriedQuestItems) {
                // Get quest/find condition for carried quest item
                const questAndFindItemConditionId = this.questHelper.getFindItemConditionByQuestItem(questItem, activeQuestIdsInProfile, allQuests);
                if (Object.keys(questAndFindItemConditionId)?.length > 0) {
                    this.profileHelper.removeQuestConditionFromProfile(pmcData, questAndFindItemConditionId);
                }
            }
            // Empty out stored quest items from player inventory
            pmcData.Stats.Eft.CarriedQuestItems = [];
        }
        return pmcData;
    }
    deleteInventoryWithoutInsuranceItems(pmcData, sessionID) {
        const insuredItems = [];
        let deleteObj = {
            "DeleteItem": [],
            "DeleteInsurance": []
        };
        const dbParentIdsToCheck = [
            "5795f317245977243854e041", // Container
            "5448e54d4bdc2dcc718b4568", // Armor
            "5448e5284bdc2dcb718b4567", // Vest
            "5448e53e4bdc2d60728b4567", // Backpack
            "5a341c4086f77401f2541505", // Headwear
            "5447bed64bdc2d97278b4568", // Machine Guns
            "5447b6254bdc2dc3278b4568", // Snipers Rifles
            "5447b5e04bdc2d62278b4567", // Smgs
            "5447b6094bdc2dc3278b4567", // Shotguns
            "5447b5cf4bdc2d65278b4567", // Pistol
            "5447b6194bdc2d67278b4567", // Marksman Rifles
            "5447b5f14bdc2d61278b4567", // Assault Rifles
            "5447b5fc4bdc2d87278b4567", // Assault Carbines
            "617f1ef5e8b54b0998387733" // Revolvers
        ];
        // dump all insured items in a simple array
        for (const insItem of pmcData.InsuredItems) {
            insuredItems.push(insItem.itemId);
        }
        for (const item of pmcData.Inventory.items) {
            // loop through inventory items
            if (item.parentId === pmcData.Inventory.equipment) {
                // add equipped insured items to an insurance delete array
                if (insuredItems.includes(item._id)) {
                    deleteObj.DeleteInsurance.push(item._id);
                }
                // handle them pockets
                if (item.slotId.startsWith("Pockets")) {
                    deleteObj = this.handleInventoryItems(pmcData, item, insuredItems, dbParentIdsToCheck, deleteObj);
                }
                // push uninsured item to delete array
                if (!this.inRaidHelper["isItemKeptAfterDeath"](pmcData, item) && !insuredItems.includes(item._id) || item.parentId === pmcData.Inventory.questRaidItems) {
                    deleteObj.DeleteItem.push(item._id);
                }
                // Remove items inside gear items
                if (item.slotId != "hideout" && item.slotId != "FirstPrimaryWeapon" && item.slotId != "SecondPrimaryWeapon" && item.slotId != "Holster" && !this.inRaidHelper["isItemKeptAfterDeath"](pmcData, item)) {
                    deleteObj = this.handleInventoryItems(pmcData, item, insuredItems, dbParentIdsToCheck, deleteObj);
                }
                // handle equipped guns, since we don't want want them becoming unoperable in player hands
                if (item.slotId === "FirstPrimaryWeapon" || item.slotId === "SecondPrimaryWeapon" || item.slotId === "Holster") {
                    deleteObj = this.handleEquippedGuns(pmcData, item, insuredItems, dbParentIdsToCheck, deleteObj);
                }
            }
        }
        // remove insurance from equipped items
        if (this.config.LoseInsuranceOnItemAfterDeath) {
            pmcData.InsuredItems = this.removeInsuredItems(pmcData.InsuredItems, deleteObj.DeleteInsurance);
        }
        // delete items
        const inventoryItems = pmcData.Inventory.items;
        for (const itemToDelete of deleteObj.DeleteItem) {
            if (inventoryItems.findIndex((item) => item._id === itemToDelete)) {
                this.inRaidHelper["inventoryHelper"].removeItem(pmcData, itemToDelete, sessionID);
            }
        }
        pmcData.Inventory.fastPanel = {};
    }
    handleInventoryItems(pmcData, item, insuredItems, dbParentIdsToCheck, returnObj) {
        for (const itemInInventory of pmcData.Inventory.items.filter(x => x.parentId == item._id)) {
            // Don't delete items in special slots
            // also skip insured items
            if (!itemInInventory.slotId.includes("SpecialSlot")) {
                // add equipped insured items to an insurance delete array
                if (insuredItems.includes(itemInInventory._id)) {
                    returnObj.DeleteInsurance.push(itemInInventory._id);
                }
                if (!insuredItems.includes(itemInInventory._id) && !returnObj.DeleteItem.includes(itemInInventory._id) && !this.isRequiredArmorPlate(itemInInventory, item)) {
                    returnObj.DeleteItem.push(itemInInventory._id);
                }
                else if (dbParentIdsToCheck.includes(this.databaseService.getTemplates().items[itemInInventory._tpl]._parent)) {
                    returnObj = this.handleInventoryItems(pmcData, itemInInventory, insuredItems, dbParentIdsToCheck, returnObj);
                }
            }
        }
        return returnObj;
    }
    handleEquippedGuns(pmcData, item, insuredItems, dbParentIdsToCheck, returnObj) {
        for (const itemInInventory of pmcData.Inventory.items.filter(x => x.parentId == item._id)) {
            // skip if its ammo, we want to keep it
            if (this.databaseService.getTemplates().items[itemInInventory._tpl]._parent === "5485a8684bdc2da71d8b4567") {
                continue;
            }
            // add to insured array if insured
            if (insuredItems.includes(itemInInventory._id)) {
                returnObj.DeleteInsurance.push(itemInInventory._id);
            }
            if (this.databaseService.getTemplates().items[item._tpl]._props.Slots.length != 0) {
                for (const slotsIndex in this.databaseService.getTemplates().items[item._tpl]._props.Slots) {
                    if (this.databaseService.getTemplates().items[item._tpl]._props.Slots[slotsIndex]._props.filters[0].Filter.includes(itemInInventory._tpl)) {
                        // check if the item is required, like pistol grips, gasblocks, etc
                        if (!insuredItems.includes(itemInInventory._id) && !returnObj.DeleteItem.includes(itemInInventory._id) && this.databaseService.getTemplates().items[item._tpl]._props.Slots[slotsIndex]._required === false) {
                            returnObj.DeleteItem.push(itemInInventory._id);
                            break;
                        }
                    }
                }
            }
            else if (!insuredItems.includes(itemInInventory._id) && !returnObj.DeleteItem.includes(itemInInventory._id)) {
                returnObj.DeleteItem.push(itemInInventory._id);
            }
            // if item can have slots and is insured, call this function again
            if (this.databaseService.getTemplates().items[itemInInventory._tpl]._props.Slots.length != 0 && insuredItems.includes(itemInInventory._id)) {
                returnObj = this.handleEquippedGuns(pmcData, itemInInventory, insuredItems, dbParentIdsToCheck, returnObj);
            }
        }
        return returnObj;
    }
    removeInsuredItems(insuredItemsList, itemsToRemove) {
        const returnList = insuredItemsList.filter(entry => !itemsToRemove.includes(entry.itemId));
        return returnList;
    }
    isRequiredArmorPlate(item, parent) {
        if (!item.slotId)
            return false;
        const itemTemplates = this.databaseService.getTables().templates.items;
        const parentTemplate = itemTemplates[parent._tpl];
        // Check to see if the slot that the item is attached to is marked as required in the parent item's template.
        let isRequiredSlot = false;
        if (parentTemplate && parentTemplate._props?.Slots) {
            isRequiredSlot = parentTemplate._props.Slots.some(slot => slot._name === item.slotId && slot._required);
        }
        return isRequiredSlot;
    }
};
exports.InraidControllerExtension = InraidControllerExtension;
exports.InraidControllerExtension = InraidControllerExtension = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("SaveServer")),
    __param(2, (0, tsyringe_1.inject)("JsonUtil")),
    __param(3, (0, tsyringe_1.inject)("TimeUtil")),
    __param(4, (0, tsyringe_1.inject)("DatabaseService")),
    __param(5, (0, tsyringe_1.inject)("TraderServicesService")),
    __param(6, (0, tsyringe_1.inject)("LocalisationService")),
    __param(7, (0, tsyringe_1.inject)("PmcChatResponseService")),
    __param(8, (0, tsyringe_1.inject)("MatchBotDetailsCacheService")),
    __param(9, (0, tsyringe_1.inject)("QuestHelper")),
    __param(10, (0, tsyringe_1.inject)("ItemHelper")),
    __param(11, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(12, (0, tsyringe_1.inject)("PlayerScavGenerator")),
    __param(13, (0, tsyringe_1.inject)("NotificationSendHelper")),
    __param(14, (0, tsyringe_1.inject)("HealthHelper")),
    __param(15, (0, tsyringe_1.inject)("TraderHelper")),
    __param(16, (0, tsyringe_1.inject)("InsuranceService")),
    __param(17, (0, tsyringe_1.inject)("InRaidHelper")),
    __param(18, (0, tsyringe_1.inject)("ApplicationContext")),
    __param(19, (0, tsyringe_1.inject)("ConfigServer")),
    __param(20, (0, tsyringe_1.inject)("MailSendService")),
    __param(21, (0, tsyringe_1.inject)("RandomUtil")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _b : Object, typeof (_c = typeof JsonUtil_1.JsonUtil !== "undefined" && JsonUtil_1.JsonUtil) === "function" ? _c : Object, typeof (_d = typeof TimeUtil_1.TimeUtil !== "undefined" && TimeUtil_1.TimeUtil) === "function" ? _d : Object, typeof (_e = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _e : Object, typeof (_f = typeof TraderServicesService_1.TraderServicesService !== "undefined" && TraderServicesService_1.TraderServicesService) === "function" ? _f : Object, typeof (_g = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _g : Object, typeof (_h = typeof PmcChatResponseService_1.PmcChatResponseService !== "undefined" && PmcChatResponseService_1.PmcChatResponseService) === "function" ? _h : Object, typeof (_j = typeof MatchBotDetailsCacheService_1.MatchBotDetailsCacheService !== "undefined" && MatchBotDetailsCacheService_1.MatchBotDetailsCacheService) === "function" ? _j : Object, typeof (_k = typeof QuestHelper_1.QuestHelper !== "undefined" && QuestHelper_1.QuestHelper) === "function" ? _k : Object, typeof (_l = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _l : Object, typeof (_m = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _m : Object, typeof (_o = typeof PlayerScavGenerator_1.PlayerScavGenerator !== "undefined" && PlayerScavGenerator_1.PlayerScavGenerator) === "function" ? _o : Object, typeof (_p = typeof NotificationSendHelper_1.NotificationSendHelper !== "undefined" && NotificationSendHelper_1.NotificationSendHelper) === "function" ? _p : Object, typeof (_q = typeof HealthHelper_1.HealthHelper !== "undefined" && HealthHelper_1.HealthHelper) === "function" ? _q : Object, typeof (_r = typeof TraderHelper_1.TraderHelper !== "undefined" && TraderHelper_1.TraderHelper) === "function" ? _r : Object, typeof (_s = typeof InsuranceService_1.InsuranceService !== "undefined" && InsuranceService_1.InsuranceService) === "function" ? _s : Object, typeof (_t = typeof InRaidHelper_1.InRaidHelper !== "undefined" && InRaidHelper_1.InRaidHelper) === "function" ? _t : Object, typeof (_u = typeof ApplicationContext_1.ApplicationContext !== "undefined" && ApplicationContext_1.ApplicationContext) === "function" ? _u : Object, typeof (_v = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _v : Object, typeof (_w = typeof MailSendService_1.MailSendService !== "undefined" && MailSendService_1.MailSendService) === "function" ? _w : Object, typeof (_x = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _x : Object])
], InraidControllerExtension);
//# sourceMappingURL=InraidControllerExtension.js.map