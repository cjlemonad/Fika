"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const jsonc_1 = require("C:/snapshot/project/node_modules/jsonc");
const path_1 = __importDefault(require("path"));
class PerfectRepair {
    modConfig;
    postSptLoad(container) {
        const vfs = container.resolve("VFS");
        this.modConfig = jsonc_1.jsonc.parse(vfs.readFile(path_1.default.resolve(__dirname, "../config/config.jsonc")));
        const databaseServer = container.resolve("DatabaseServer");
        const configServer = container.resolve("ConfigServer");
        configServer.getConfig(ConfigTypes_1.ConfigTypes.REPAIR)["applyRandomizeDurabilityLoss"] = false;
        if (this.modConfig.Armor) {
            const armorMaterials = databaseServer.getTables().globals.config.ArmorMaterials;
            for (const materialId in armorMaterials) {
                if (!this.modConfig.RestrictPerfectRepairToKits) {
                    armorMaterials[materialId].MinRepairDegradation = 0.0;
                    armorMaterials[materialId].MaxRepairDegradation = 0.0;
                }
                armorMaterials[materialId].MinRepairKitDegradation = 0.0;
                armorMaterials[materialId].MaxRepairKitDegradation = 0.0;
            }
        }
        if (this.modConfig.Weapon) {
            const itemDatabase = databaseServer.getTables().templates.items;
            for (const itemId in itemDatabase) {
                const item = itemDatabase[itemId];
                if (item._props.MaxRepairDegradation !== undefined && item._props.MaxRepairKitDegradation !== undefined) {
                    if (!this.modConfig.RestrictPerfectRepairToKits) {
                        item._props.MinRepairDegradation = 0.0;
                        item._props.MaxRepairDegradation = 0.0;
                    }
                    item._props.MinRepairKitDegradation = 0.0;
                    item._props.MaxRepairKitDegradation = 0.0;
                }
            }
        }
    }
}
exports.mod = new PerfectRepair();
//# sourceMappingURL=mod.js.map