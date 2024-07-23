import { DependencyContainer } from "tsyringe";
import crypto from "crypto";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { DialogueHelper } from "@spt/helpers/DialogueHelper";
import { IPostSptLoadMod } from "@spt/models/external/IPostSptLoadMod";
import type { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { ImageRouter } from "@spt/routers/ImageRouter";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { PlayerService } from "@spt/services/PlayerService";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { ITraderConfig, UpdateTime } from "@spt/models/spt/config/ITraderConfig";
import { MatchController } from "@spt/controllers/MatchController";
import { HealthController } from "@spt/controllers/HealthController";
import { InraidController } from "@spt/controllers/InraidController";
import { IModLoader } from "@spt/models/spt/mod/IModLoader";
import { PreSptModLoader } from "@spt/loaders/PreSptModLoader";
import { JsonUtil } from "@spt/utils/JsonUtil";
import { Traders } from "@spt/models/enums/Traders";
import { QuestStatus } from "@spt/models/enums/QuestStatus";
import { MessageType } from "@spt/models/enums/MessageType";
import { HashUtil } from "@spt/utils/HashUtil";
import { VFS } from "@spt/utils/VFS"
import { SaveServer } from "@spt/servers/SaveServer"
import { ProfileHelper } from "@spt/helpers/ProfileHelper";
import { QuestHelper } from "@spt/helpers/QuestHelper";
import { MailSendService } from "@spt/services/MailSendService"
import { NotificationSendHelper } from "@spt/helpers/NotificationSendHelper";
import { NotifierHelper } from "@spt/helpers/NotifierHelper";
import { ImporterUtil } from "@spt/utils/ImporterUtil"
import { BundleLoader } from "@spt/loaders/BundleLoader";
import { HealthHelper } from "@spt/helpers/HealthHelper";
//
class Mod implements IPreSptLoadMod {
    private static container: DependencyContainer;
    public preSptLoad(container: DependencyContainer): void {
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const preSptModLoader = container.resolve("PreSptModLoader");
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");
        const imageRouter = container.resolve<ImageRouter>("ImageRouter")
    }
    public postSptLoad(container: DependencyContainer): void {
        const Logger = container.resolve<ILogger>("WinstonLogger");
        const PreSptModLoader = container.resolve("PreSptModLoader");
        const FuncDatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const FuncImporterUtil = container.resolve<ImporterUtil>("ImporterUtil")
        const VFS = container.resolve<VFS>("VFS");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ClientDB = FuncDatabaseServer.getTables();
        const ModPath = PreSptModLoader.getModPath("塔科夫控制台")
        const DB = FuncImporterUtil.loadRecursive(`${ModPath}db/`)
    }
    public postDBLoad(container: DependencyContainer): void {
        const Logger = container.resolve<ILogger>("WinstonLogger");
        const PreSptModLoader = container.resolve("PreSptModLoader");
        const FuncDatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const FuncImporterUtil = container.resolve<ImporterUtil>("ImporterUtil")
        const VFS = container.resolve<VFS>("VFS");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ClientDB = FuncDatabaseServer.getTables();
        const ModPath = PreSptModLoader.getModPath("塔科夫控制台")
        const DB = FuncImporterUtil.loadRecursive(`${ModPath}db/`)
        const AllItems = ClientDB.templates.items;
        var Therapist = "54cb57776803fa99248b456e"
        var AssortData = ClientDB.traders[Therapist].assort
        const Locale = ClientDB.locales.global["ch"]
        const ELocale = ClientDB.locales.global["en"]

        const profileHelper = container.resolve<ProfileHelper>("ProfileHelper");
        const questHelper = container.resolve<QuestHelper>("QuestHelper");
        const diaoluehelper = container.resolve<DialogueHelper>("DialogueHelper")
        const healthController = container.resolve<HealthController>("HealthController")
        const saveServer = container.resolve<SaveServer>("SaveServer");
        const mailSendService = container.resolve<MailSendService>("MailSendService");
        const matchController = container.resolve<MatchController>("MatchController");
        const inRaidController = container.resolve<InraidController>("InraidController");
        const playerService = container.resolve<PlayerService>("PlayerService");
        const readline = require('readline');
        const playerlist = JsonUtil.deserialize(VFS.readFile(`${ModPath}玩家索引表.json`));
        const itemlist = JsonUtil.deserialize(VFS.readFile(`${ModPath}物品索引表.json`));
        const skilllist = JsonUtil.deserialize(VFS.readFile(`${ModPath}技能索引表.json`));
        const questlist = JsonUtil.deserialize(VFS.readFile(`${ModPath}任务索引表.json`));
        Locale["DefaultMessage"] = "由控制台发送的物品"
        const ClientItems = ClientDB.templates.items
        const levelMap = ClientDB.globals.config.exp.level.exp_table
        process.stdin.setEncoding('utf-8');
        process.stdout.setEncoding('utf-8');


        const https = require('https');

        function fetchData() {
            return new Promise((resolve, reject) => {
                const options = {
                    hostname: 'api.example.com',
                    path: '/data',
                    method: 'GET'
                };

                const req = https.request(options, (res) => {
                    let data = '';

                    res.on('data', (chunk) => {
                        data += chunk;
                    });

                    res.on('end', () => {
                        resolve(JSON.parse(data));
                    });
                });

                req.on('error', (error) => {
                    reject(error);
                });

                req.end();
            });
        }

        fetchData()
            .then(data => {
                //console.log('Fetched data:', data);
            })
            .catch(error => {
                //console.error('Error:', error);
                console.log("欢迎使用塔科夫控制台,在服务端输入help查询帮助")

            });


        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false // 禁用终端模式
        });

        // 监听输入事件
        rl.on('line', (input) => {
            const filteredInput = input.replace(/[\u001b\u001b[A[B[C[D]|\u007f\t\r\n]/g, '');
            const [command, ...params] = filteredInput.split(' ');

            switch (command) {
                case 'give':
                    addItem(params);
                    break;
                case 'additemgroup':
                    //handleAddItemGroupCommand(params);
                    break;
                case 'playerlist':
                    Playerlist();
                    break;
                case 'questlist':
                    writeQuestlist();
                    break;
                case 'itemlist':
                    writeItemList();
                    break;
                case 'start':
                    startQuest(params);
                    break;
                case 'finish':
                    completeQuest(params);
                    break;
                case 'quest':
                    quest(params);
                    break;
                case 'help':
                    help();
                    break;
                case 'endraid':
                    //callEndRaid(params);
                    break;
                case 'skill':
                    setSkill(params);
                    break;
                case 'level':
                    //setLevel(params);
                    break;
                case 'exp':
                    editExp(params);
                    break;
                case 'cwp':
                    convertWeaponPreset(params);
                    break;
                case 'exit':
                    console.log('程序即将退出');
                    rl.close();
                    break;
                default:
                    console.log('未知命令');
                    break;
            }

            rl.prompt(); // 清空输入缓冲区并重新显示提示符
        });
        //console.log(JSON.stringify(saveServer.getProfiles(), null, 4))
        //console.log(getPlayer("test2"))
        //console.log(getItem(103))
        function callEndRaid(params) {
            if (params.length !== 1) {
                console.log('endraid命令需要1个参数!');
                return;
            }
            const [player] = params;
            console.log(getPlayer(player))
            inRaidController.savePostRaidProgress(
                {
                    "exit": "survived",
                    "profile": saveServer.getProfile(getPlayer(player)).characters.pmc,
                    "isPlayerScav": false,
                    "health": getHealth(getPlayer(player)),
                    "insurance": []
                },
                getPlayer(player));
            console.log(getPlayer(player))
            console.log("callRaidEndSuccessful.")
        }
        function getHealth(player) {
            const Profile = saveServer.getProfile(getPlayer(player)).characters.pmc
            var Health = {
                "Health": {
                    "Head": {
                        "Maximum": Profile.Health.BodyParts.Head.Maximum,
                        "Current": Profile.Health.BodyParts.Head.Current,
                        "Effects": {}
                    },
                    "LeftArm": {
                        "Maximum": Profile.Health.BodyParts.LeftArm.Maximum,
                        "Current": Profile.Health.BodyParts.LeftArm.Current,
                        "Effects": {}
                    },
                    "LeftLeg": {
                        "Maximum": Profile.Health.BodyParts.LeftLeg.Maximum,
                        "Current": Profile.Health.BodyParts.LeftLeg.Current,
                        "Effects": {}
                    },
                    "RightArm": {
                        "Maximum": Profile.Health.BodyParts.RightArm.Maximum,
                        "Current": Profile.Health.BodyParts.RightArm.Current,
                        "Effects": {}
                    },
                    "RightLeg": {
                        "Maximum": Profile.Health.BodyParts.RightLeg.Maximum,
                        "Current": Profile.Health.BodyParts.RightLeg.Current,
                        "Effects": {}
                    },
                    "Stomach": {
                        "Maximum": Profile.Health.BodyParts.Stomach.Maximum,
                        "Current": Profile.Health.BodyParts.Stomach.Current,
                        "Effects": {}
                    }
                },
                "IsAlive": true,
                "Hydration": Profile.Health.Hydration.Current,
                "Energy": Profile.Health.Energy.Current,
                "Temperature": Profile.Health.Temperature.Current
            }
            return Health
        }
        // 处理additem命令
        function addItem(params) {
            if (params.length !== 3) {
                console.log('give命令需要3个参数!');
                return;
            }
            const [player, itemId, quantity] = params;
            if (player == "@a") {
                for (let pl in JsonUtil.deserialize(VFS.readFile(`${ModPath}玩家索引表.json`))) {
                    handleAddItemCommand([pl, itemId, quantity])
                }
            }
            else {
                handleAddItemCommand(params)
            }
        }
        function handleAddItemCommand(params) {
            if (params.length !== 3) {
                console.log('give命令需要3个参数!');
                return;
            }
            const [player, itemId, quantity] = params;
            var CacheItemID = getItem(itemId)
            var CachePlayerID = getPlayer(player)
            if (getItemName(CacheItemID) != null) {
                if (CachePlayerID != undefined && saveServer.getProfile(CachePlayerID).characters.pmc.Info.Nickname != undefined) {
                    if (createItemArr(CacheItemID, quantity).length > 0) {
                        mailSendService.sendLocalisedSystemMessageToPlayer(
                            CachePlayerID,
                            "DefaultMessage",
                            createItemArr(CacheItemID, quantity),
                            2592000
                        )
                        console.log('执行give命令');
                        console.log('玩家ID:', CachePlayerID);
                        console.log('玩家名:', saveServer.getProfile(CachePlayerID).characters.pmc.Info.Nickname);
                        console.log('物品ID:', CacheItemID);
                        console.log('物品名:', getItemShortName(CacheItemID) + " / " + getItemEShortName(CacheItemID))
                        console.log('物品全名:', getItemName(CacheItemID) + " / " + getItemEName(CacheItemID))
                        console.log('物品数量:', quantity);
                        console.log("物品发送成功")
                        //console.log(createItemArr(CacheItemID, quantity))
                    }
                }
                else {
                    console.log("玩家不存在,请检查索引表!")
                }
            }
            else {
                console.log("物品不存在或ID错误,请检查索引表!")
            }
            // 在这里执行additem命令的逻辑

        }
        function convertArrayToObject(array) {
            const mod = {};

            // 遍历数组中的每个成员
            array.forEach(member => {
                const { _id, _tpl, parentId, slotId } = member;

                // 如果成员是武器本体，则跳过
                if (parentId === undefined) {
                    return;
                }

                // 获取父成员的 _tpl 属性值
                const parentTpl = array.find(item => item._id === parentId)._tpl;

                // 创建 mod 对象的键名
                const stringId = parentTpl || _tpl;

                // 如果 mod 对象中不存在该键，则初始化为空对象
                if (!mod[stringId]) {
                    mod[stringId] = {};
                }

                // 获取 mod 对象的子对象
                const modObject = mod[stringId];

                // 如果 mod 对象的子对象中不存在该键名，则初始化为空数组
                if (!modObject[slotId]) {
                    modObject[slotId] = [];
                }

                // 将当前成员的 _tpl 属性值添加到 mod 对象的子对象中
                modObject[slotId].push(_tpl);
            });

            return mod;

        }
        function deepCopy(obj) {
            if (typeof obj !== 'object' || obj === null) {
                return obj;
            }

            var copy = Array.isArray(obj) ? [] : {};

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    copy[key] = deepCopy(obj[key]);
                }
            }

            return copy;
        }
        function convertPresetToAssort(array, name) {
            var arr = []
            arr.push({
                "_id": GenerateHash(`${name}_Assort_${array[0]._id}`),
                "_tpl": array[0]._tpl,
                "parentId": "hideout",
                "slotId": "hideout",
                "upd": {
                    "StackObjectsCount": 100,
                    "BuyRestrictionMax": 1,
                    "BuyRestrictionCurrent": 0,
                    "Repairable": {
                        "Durability": 100,
                        "MaxDurability": 100
                    }
                }
            })
            for (var i = 1; i < array.length; i++) {
                arr.push({
                    "_id": GenerateHash(`${name}_Assort_${array[i]._id}`),
                    "_tpl": array[i]._tpl,
                    "parentId": GenerateHash(`${name}_Assort_${array[i].parentId}`),
                    "slotId": array[i].slotId
                })
            }
            return arr
        }
        function convertPreset(array, name) {
            var arr = []
            arr.push(deepCopy(array[0]))
            for (var i = 1; i < array.length; i++) {
                arr.push(deepCopy(array[i]))
            }
            arr[0]._id = GenerateHash(`${name}_Vanilla_${arr[0]._id}`)
            for (var i = 1; i < arr.length; i++) {
                arr[i]._id = GenerateHash(`${name}_Vanilla_${arr[i]._id}`)
                arr[i].parentId = GenerateHash(`${name}_Vanilla_${arr[i].parentId}`)
            }
            return arr
        }
        function convertWeaponPreset(params) {
            if (params.length !== 1) {
                console.log('cwp命令需要1个参数!');
                return;
            }
            const [player] = params;
            var CachePlayerID = getPlayer(player)
            var PresetObj = {}
            const Preset = saveServer.getProfile(CachePlayerID)?.userbuilds?.weaponBuilds
            if (Preset?.length > 0) {
                console.log('执行cwp命令');
                for (var i = 0; i < Preset.length; i++) {
                    var Items = Preset[i].Items //Arr
                    var PresetName = getItemName(Items[0]._tpl)
                    if (!PresetObj[PresetName]) {
                        PresetObj[PresetName] = {}
                        PresetObj[PresetName].ItemID = Items[0]._tpl
                        PresetObj[PresetName].ItemName = PresetName
                    }
                    console.log('检测到武器预设:', CachePlayerID);
                    console.log('武器名称:', PresetName);
                    console.log('正在转换预设....');
                    PresetObj[PresetName][Preset[i].Name] = {}
                    PresetObj[PresetName][Preset[i].Name].ID = Preset[i].Id
                    PresetObj[PresetName][Preset[i].Name].Name = Preset[i].Name
                    PresetObj[PresetName][Preset[i].Name].ModPreset = convertArrayToObject(Items)
                    PresetObj[PresetName][Preset[i].Name].AssortPreset = convertPresetToAssort(Items, Preset[i].Name)
                    PresetObj[PresetName][Preset[i].Name].VanillaPreset = convertPreset(Items, Preset[i].Name)
                }
            }
            VFS.writeFile(`${ModPath}PresetExport.json`, JSON.stringify(PresetObj, null, 4))
            console.log(`所有武器预设转换完毕,导出到${ModPath}PresetExport.json.`);
            //console.log(createItemArr(CacheItemID, quantity))
        }
        // 在这里执行additem命令的逻辑


        function startQuest(params) {
            if (params.length !== 2) {
                console.log('start命令需要2个参数!');
                return;
            }
            const [player, questid] = params;
            var CachePlayerID = getPlayer(player)
            if (getQuest(questid) != null) {
                if (CachePlayerID != undefined && saveServer.getProfile(CachePlayerID).characters.pmc.Info.Nickname != undefined) {
                    const Quests = saveServer.getProfile(getPlayer(player)).characters.pmc.Quests
                    var Quest = Quests.findIndex(x => x.qid == getQuest(questid))
                    //console.log(Quest)
                    //console.log(Quests[Quest])
                    if (Quest == -1) {
                        Quests.push({
                            "qid": getQuest(questid),
                            "startTime": 1694930433,
                            "status": 2,
                            "statusTimers": {},
                            "completedConditions": [],
                            "availableAfter": 0
                        })
                    }
                    else {
                        Quests[Quest].status = 2
                        Quests[Quest].statusTimers = {}
                    }
                    console.log('执行start命令');
                    console.log('玩家ID:', CachePlayerID);
                    console.log('玩家名:', saveServer.getProfile(CachePlayerID).characters.pmc.Info.Nickname);
                    console.log('任务ID:', getQuest(questid));
                    console.log('任务名:', getQuestName(getQuest(questid)) + " / " + getQuestEName(getQuest(questid)))
                    console.log('所属商人:', getTraderName(getTrader(questid)));
                    console.log('商人ID:', getTrader(questid));
                    console.log("任务已接取,请重启游戏以应用更改")
                    //console.log(Quests.findIndex(x => x.qid == getQuest(questid)))
                    //console.log(Quests[Quest])
                }
                else {
                    console.log("玩家不存在,请检查索引表!")
                }
            }
            else {
                console.log("任务不存在或ID出错,请检查索引表!")
            }
        }
        function setLevel(params) {
            if (params.length !== 2) {
                console.log('level命令需要2个参数!');
                return;
            }
            const [player, level] = params;
            var CachePlayerID = getPlayer(player)
            if (CachePlayerID != undefined) {
                if (saveServer.getProfile(CachePlayerID).characters.pmc.Info.Nickname != undefined) {
                    const Info = saveServer.getProfile(getPlayer(player)).characters.pmc.Info
                    //console.log(Quest)
                    //console.log(Quests[Quest])
                    console.log('执行level命令');
                    console.log('玩家ID:', CachePlayerID);
                    console.log('玩家名:', saveServer.getProfile(CachePlayerID).characters.pmc.Info.Nickname);
                    console.log('修改前等级:', Info.Level);
                    Info.Level = Number(level)
                    Info.Experience = levelMap[Number(level)].exp
                    console.log('修改后等级:', Info.Level);
                    console.log("等级修改成功,请重启游戏以应用更改")
                    //console.log(Quests.findIndex(x => x.qid == getQuest(questid)))
                    //console.log(Quests[Quest])
                }
                else {
                    console.log("玩家不存在,请检查索引表!")
                }
            }
            else {
                console.log("任务不存在或ID出错,请检查索引表!")
            }
        }
        function editExp(params) {
            if (params.length !== 2) {
                console.log('exp命令需要2个参数!');
                return;
            }
            const [player, count] = params;
            var CachePlayerID = getPlayer(player)
            if (CachePlayerID != undefined) {
                if (saveServer.getProfile(CachePlayerID).characters.pmc.Info.Nickname != undefined) {
                    const Info = saveServer.getProfile(getPlayer(player)).characters.pmc.Info
                    //console.log(Quest)
                    //console.log(Quests[Quest])
                    console.log('执行exp命令');
                    console.log('玩家ID:', CachePlayerID);
                    console.log('玩家名:', saveServer.getProfile(CachePlayerID).characters.pmc.Info.Nickname);
                    console.log('修改前经验:', Info.Experience);
                    Info.Level = Number(count)
                    Info.Experience += Number(count)
                    console.log('修改后经验:', Info.Experience);
                    console.log('经验增加了' + Number(count) + "点");
                    console.log("经验修改成功,请重启游戏以应用更改")
                    //console.log(Quests.findIndex(x => x.qid == getQuest(questid)))
                    //console.log(Quests[Quest])
                }
                else {
                    console.log("玩家不存在,请检查索引表!")
                }
            }
            else {
                console.log("任务不存在或ID出错,请检查索引表!")
            }
        }
        function completeQuest(params) {
            if (params.length !== 2) {
                console.log('finish命令需要2个参数!');
                return;
            }
            const [player, questid] = params;
            var CachePlayerID = getPlayer(player)
            if (getQuest(questid) != null) {
                if (CachePlayerID != undefined && saveServer.getProfile(CachePlayerID).characters.pmc.Info.Nickname != undefined) {
                    const Quests = saveServer.getProfile(getPlayer(player)).characters.pmc.Quests
                    var Quest = Quests.findIndex(x => x.qid == getQuest(questid))
                    //console.log(Quest)
                    //console.log(Quests[Quest])
                    if (Quest == -1) {
                        Quests.push({
                            "qid": getQuest(questid),
                            "startTime": 1694930433,
                            "status": 3,
                            "statusTimers": {},
                            "completedConditions": [],
                            "availableAfter": 0
                        })
                    }
                    else {
                        Quests[Quest].status = 3
                        Quests[Quest].statusTimers = {}
                    }
                    console.log('执行finish命令');
                    console.log('玩家ID:', CachePlayerID);
                    console.log('玩家名:', saveServer.getProfile(CachePlayerID).characters.pmc.Info.Nickname);
                    console.log('任务ID:', getQuest(questid));
                    console.log('任务名:', getQuestName(getQuest(questid)) + " / " + getQuestEName(getQuest(questid)))
                    console.log('所属商人:', getTraderName(getTrader(questid)));
                    console.log('商人ID:', getTrader(questid));
                    console.log("任务已完成,请重启游戏以应用更改")
                    //console.log(Quests.findIndex(x => x.qid == getQuest(questid)))
                    //console.log(Quests[Quest])
                }
                else {
                    console.log("玩家不存在,请检查索引表!")
                }
            }
            else {
                console.log("任务不存在或ID出错,请检查索引表!")
            }
        }
        function quest(params) {
            if (params.length !== 3) {
                console.log('quest命令需要3个参数!');
                return;
            }
            const [player, questid, status] = params;
            if (player == "@a") {
                for (let pl in JsonUtil.deserialize(VFS.readFile(`${ModPath}玩家索引表.json`))) {
                    editQuest([pl, questid, status])
                }
            }
            else {
                editQuest(params)
            }
        }
        function help() {
            console.log("命令列表:")
            console.log("give")
            console.log("向指定玩家/全体玩家发送物品")
            console.log("使用方法:give 玩家名 物品数字ID 数量")
            console.log("使用@a代替玩家名可向所有玩家执行")
            console.log("skill")
            console.log("改变指定玩家的技能等级")
            console.log("使用方法:skill 玩家名 技能数字ID 等级")
            console.log("需要重启游戏以应用更改(无需关闭服务端)")
            console.log("exp")
            console.log("给予指定玩家一定数量的经验")
            console.log("使用方法:exp 玩家名 经验值")
            console.log("需要重启游戏以应用更改(无需关闭服务端)")
            console.log("start")
            console.log("强制指定玩家开始任务")
            console.log("使用方法:start 玩家名 任务数字ID")
            console.log("需要重启游戏以应用更改(无需关闭服务端)")
            console.log("finish")
            console.log("强制指定玩家完成任务")
            console.log("使用方法:finish 玩家名 任务数字ID")
            console.log("需要重启游戏以应用更改(无需关闭服务端)")
            console.log("quest")
            console.log("强制修改指定玩家的任务状态")
            console.log("使用方法:quest 玩家名 任务数字ID 状态码")
            console.log("使用@a代替玩家名可向所有玩家执行")
            console.log("需要重启游戏以应用更改(无需关闭服务端)")
            console.log("playerlist")
            console.log("列出玩家列表并创建玩家索引表")
            console.log("questlist")
            console.log("创建任务索引表")
            console.log("itemlist")
            console.log("创建物品索引表")
            console.log("help")
            console.log("查询帮助")
        }
        function editQuest(params) {
            if (params.length !== 3) {
                console.log('quest命令需要3个参数!');
                return;
            }
            const [player, questid, status] = params;
            var CachePlayerID = getPlayer(player)
            if (getQuest(questid) != null) {
                if (CachePlayerID != undefined && saveServer.getProfile(CachePlayerID).characters.pmc.Info.Nickname != undefined) {
                    const Quests = saveServer.getProfile(getPlayer(player)).characters.pmc.Quests
                    var Quest = Quests.findIndex(x => x.qid == getQuest(questid))
                    //console.log(Quest)
                    //console.log(Quests[Quest])
                    console.log('执行quest命令');
                    console.log('玩家ID:', CachePlayerID);
                    console.log('玩家名:', saveServer.getProfile(CachePlayerID).characters.pmc.Info.Nickname);
                    console.log('任务ID:', getQuest(questid));
                    console.log('任务名:', getQuestName(getQuest(questid)) + " / " + getQuestEName(getQuest(questid)))
                    console.log('所属商人:', getTraderName(getTrader(questid)));
                    console.log('商人ID:', getTrader(questid));
                    if (Quest == -1) {
                        Quests.push({
                            "qid": getQuest(questid),
                            "startTime": 1694930433,
                            "status": Number(status),
                            "statusTimers": {},
                            "completedConditions": [],
                            "availableAfter": 0
                        })
                        console.log('修改前状态码:-1(未激活)');
                        switch (Number(status)) {
                            case 0:
                                console.log('修改后状态码:0(未解锁)');
                                break;
                            case 1:
                                console.log('修改后状态码:1(待接取)');
                                break;
                            case 2:
                                console.log('修改后状态码:2(进行中)');
                                break;
                            case 3:
                                console.log('修改后状态码:3(待交付)');
                                break;
                            case 4:
                                console.log('修改后状态码:4(已完成)');
                                break;
                            case 5:
                                console.log('修改后状态码:5(已失败)');
                                break;

                        }
                    }
                    else {
                        switch (Quests[Quest].status) {
                            case 0:
                                console.log('修改前状态码:0(未解锁)');
                                break;
                            case 1:
                                console.log('修改前状态码:1(待接取)');
                                break;
                            case 2:
                                console.log('修改前状态码:2(进行中)');
                                break;
                            case 3:
                                console.log('修改前状态码:3(待交付)');
                                break;
                            case 4:
                                console.log('修改前状态码:4(已完成)');
                                break;
                            case 5:
                                console.log('修改前状态码:5(已失败)');
                                break;

                        }
                        Quests[Quest].status = Number(status)
                        Quests[Quest].statusTimers = {}
                        switch (Number(status)) {
                            case 0:
                                console.log('修改后状态码:0(未解锁)');
                                break;
                            case 1:
                                console.log('修改后状态码:1(待接取)');
                                break;
                            case 2:
                                console.log('修改后状态码:2(进行中)');
                                break;
                            case 3:
                                console.log('修改后状态码:3(待交付)');
                                break;
                            case 4:
                                console.log('修改后状态码:4(已完成)');
                                break;
                            case 5:
                                console.log('修改后状态码:5(已失败)');
                                break;

                        }
                    }
                    console.log("任务进度修改成功,请重启游戏以应用更改")
                    //console.log(Quests.findIndex(x => x.qid == getQuest(questid)))
                    //console.log(Quests[Quest])
                }
                else {
                    console.log("玩家不存在,请检查索引表!")
                }
            }
            else {
                console.log("任务不存在或ID出错,请检查索引表!")
            }
        }
        function writeQuestlist() {
            var QUEST = FuncDatabaseServer.getTables().templates.quests
            var QUESTLIST = []
            var i = 0
            for (let qt in QUEST) {
                var questid = QUEST[qt]._id
                if (getQuestName(questid) != null) {
                    QUESTLIST.push({
                        "数字ID": i,
                        "任务ID": questid,
                        "中文名": getQuestName(questid),
                        "英文名": getQuestEName(questid),
                        "商人ID": QUEST[qt].traderId,
                        "商人名": getTraderName(QUEST[qt].traderId)
                    })
                    i++
                }
            }
            VFS.writeFile(`${ModPath}任务索引表.json`, JSON.stringify(QUESTLIST, null, 4))
            console.log("任务索引表创建完成.")
        }
        function writeItemList() {
            var ITEM = FuncDatabaseServer.getTables().templates.items
            var ITEMLIST = []
            var i = 0
            for (let it in ITEM) {
                var itemid = ITEM[it]._id
                if (getItemName(itemid) != null && ITEM[it]._props && ITEM[it]._props.Prefab && ITEM[it]._props.Prefab.path != "") {
                    ITEMLIST.push({
                        "数字ID": i,
                        "物品ID": itemid,
                        "中文名": getItemShortName(itemid),
                        "中文全名": getItemName(itemid),
                        "英文名": getItemEShortName(itemid),
                        "英文全名": getItemEName(itemid)
                    })
                    i++
                }
            }
            VFS.writeFile(`${ModPath}物品索引表.json`, JSON.stringify(ITEMLIST, null, 4))
            console.log("物品索引表创建完成.")
        }
        function Playerlist() {
            const Profile = saveServer.getProfiles()
            var Profilelist = {}
            for (let pf in Profile) {
                console.log("玩家: " + Profile[pf].info.username + " 玩家名: " + Profile[pf].characters.pmc.Info.Nickname + " ID: " + Profile[pf].info.id)
                Profilelist[Profile[pf].info.username] = Profile[pf].info.id
            }
            VFS.writeFile(`${ModPath}玩家索引表.json`, JSON.stringify(Profilelist, null, 4))
            console.log("玩家索引表写入完成.")
        }
        function getTraderName(itemid) {
            var Locale = FuncDatabaseServer.getTables().locales.global["ch"]
            if (Locale[`${itemid} Nickname`] != null && Locale[`${itemid} Nickname`] != "") {
                return Locale[`${itemid} Nickname`]
            }
            else {
                return null
            }
        }
        function getQuestName(itemid) {
            var Locale = FuncDatabaseServer.getTables().locales.global["ch"]
            if (Locale[`${itemid} name`] != null && Locale[`${itemid} name`] != "") {
                return Locale[`${itemid} name`]
            }
            else {
                return null
            }
        }
        function getQuestEName(itemid) {
            var Locale = FuncDatabaseServer.getTables().locales.global["en"]
            if (Locale[`${itemid} name`] != null && Locale[`${itemid} name`] != "") {
                return Locale[`${itemid} name`]
            }
            else {
                return null
            }
        }
        function setSkill(params) {
            if (params.length !== 3) {
                console.log('skill命令需要3个参数!');
                return;
            }
            const [player, skill, level] = params;
            var CachePlayerID = getPlayer(player)
            const Player = saveServer.getProfile(getPlayer(player)).characters.pmc
            const Skills = saveServer.getProfile(getPlayer(player)).characters.pmc.Skills.Common
            const Skills2 = saveServer.getProfile(getPlayer(player)).characters.pmc.Skills
            var Skill = Skills.findIndex(x => x.Id == getSkill(skill))
            //var SkillLevel = Math.floor(Skills[Skill].Progress / 100)
            //console.log(Skills[Skill])
            //console.log(Skill)
            //console.log(Skills[Skill].Progress)
            if (getSkillName(getSkill(skill)) != null) {
                if (CachePlayerID != undefined && saveServer.getProfile(CachePlayerID).characters.pmc.Info.Nickname != undefined) {
                    if (Number(level) < 52 && Number(level) >= 0) {
                        //questHelper.rewardSkillPoints(CachePlayerID, Player, getSkill(skill), Number(level))
                        console.log('执行skill命令');
                        console.log('玩家ID:', CachePlayerID);
                        console.log('玩家名:', saveServer.getProfile(CachePlayerID).characters.pmc.Info.Nickname);
                        console.log('技能ID:', getSkill(skill));
                        console.log('技能名:', getSkillName(getSkill(skill)) + " / " + getSkillEName(getSkill(skill)))
                        console.log('修改前等级:', Math.floor(Skills[Skill].Progress / 100));
                        //console.log(Skills[Skill].Progress)
                        Skills[Skill].Progress = Number(level) * 100
                        //console.log(Skills[Skill].Progress)
                        console.log('修改后等级:', Math.floor(Skills[Skill].Progress / 100));
                        console.log("技能等级修改成功,请重启游戏以应用更改")
                    }
                    else {
                        console.log("技能等级不能超过51级或小于0级,请重试")
                    }
                }
                else {
                    console.log("玩家不存在,请检查索引表!")
                }
            }
            else {
                console.log("技能不存在或ID错误,请检查索引表!")
            }
        }
        function getItemStack(itemid) {
            var ITEM = FuncDatabaseServer.getTables().templates.items
            if (ITEM[itemid] != null) {
                return ITEM[itemid]._props.StackMaxSize
            }
        }
        function createItemArr(itemid, count) {
            var Array = []
            var maxStack = getItemStack(itemid);
            if (havePreset(itemid)) {
                for (var i = 0; i < count; i++) {
                    var preset = getPreset(itemid, i);
                    for (var j = 0; j < preset.length; j++) {
                        Array.push(preset[j])
                    }
                }
                return Array
            }
            else {
                if (maxStack > 1) {
                    if (count > maxStack) {
                        if (count % maxStack != 0) {
                            for (var i = 0; i < Math.floor(count / maxStack); i++) {
                                Array.push({
                                    "_id": GenerateHash(`${itemid}_${i}`),
                                    "_tpl": itemid,
                                    "upd": {
                                        "SpawnedInSession": true,
                                        "StackObjectsCount": maxStack
                                    },
                                    "parentId": "62b997444agc8eb4cb013004",
                                    "slotId": "main"
                                });
                            }
                            Array.push({
                                "_id": GenerateHash(`${itemid}_${Math.floor(count / maxStack)}`),
                                "_tpl": itemid,
                                "upd": {
                                    "SpawnedInSession": true,
                                    "StackObjectsCount": (count % maxStack)
                                },
                                "parentId": "62b997444agc8eb4cb013004",
                                "slotId": "main"
                            });
                        }
                        else {
                            for (var i = 0; i < Math.floor(count / maxStack); i++) {
                                Array.push({
                                    "_id": GenerateHash(`${itemid}_${i}`),
                                    "_tpl": itemid,
                                    "upd": {
                                        "SpawnedInSession": true,
                                        "StackObjectsCount": maxStack
                                    },
                                    "parentId": "62b997444agc8eb4cb013004",
                                    "slotId": "main"
                                });
                            }
                        }
                    }
                    else {
                        Array.push({
                            "_id": GenerateHash(`${itemid}_${count}`),
                            "_tpl": itemid,
                            "upd": {
                                "SpawnedInSession": true,
                                "StackObjectsCount": count
                            },
                            "parentId": "62b997444agc8eb4cb013004",
                            "slotId": "main"
                        });
                    }
                }
                else {
                    for (var i = 0; i < count; i++) {
                        Array.push({
                            "_id": GenerateHash(`${itemid}_${i}`),
                            "_tpl": itemid,
                            "upd": {
                                "SpawnedInSession": true,
                                "StackObjectsCount": 1
                            },
                            "parentId": "62b997444agc8eb4cb013004",
                            "slotId": "main"
                        });
                    }
                }
                return Array
            }
        }
        function getItemName(itemid) {
            var Locale = FuncDatabaseServer.getTables().locales.global["ch"]
            if (Locale[`${itemid} Name`] != null && Locale[`${itemid} Name`] != "") {
                return Locale[`${itemid} Name`]
            }
            else {
                return null
            }
        }
        function getItemEName(itemid) {
            var Locale = FuncDatabaseServer.getTables().locales.global["en"]
            if (Locale[`${itemid} Name`] != null && Locale[`${itemid} Name`] != "") {
                return Locale[`${itemid} Name`]
            }
            else {
                return null
            }
        }
        function getSkillName(itemid) {
            var Locale = FuncDatabaseServer.getTables().locales.global["ch"]
            if (Locale[`${itemid}`] != null && Locale[`${itemid}`] != "") {
                return Locale[`${itemid}`]
            }
            else {
                return itemid
            }
        }
        function getSkillEName(itemid) {
            var Locale = FuncDatabaseServer.getTables().locales.global["en"]
            if (Locale[`${itemid}`] != null && Locale[`${itemid}`] != "") {
                return Locale[`${itemid}`]
            }
            else {
                return itemid
            }
        }
        function getItemShortName(itemid) {
            var Locale = FuncDatabaseServer.getTables().locales.global["ch"]
            if (Locale[`${itemid} ShortName`] != null && Locale[`${itemid} ShortName`] != "") {
                return Locale[`${itemid} ShortName`]
            }
            else {
                return null
            }
        }
        function getItemEShortName(itemid) {
            var Locale = FuncDatabaseServer.getTables().locales.global["en"]
            if (Locale[`${itemid} ShortName`] != null && Locale[`${itemid} ShortName`] != "") {
                return Locale[`${itemid} ShortName`]
            }
            else {
                return null
            }
        }
        function getPlayer(name) {
            return JsonUtil.deserialize(VFS.readFile(`${ModPath}玩家索引表.json`))[name]
        }
        function getItem(id) {
            const itemlist1 = JsonUtil.deserialize(VFS.readFile(`${ModPath}物品索引表.json`));
            if (itemlist1.find(x => x["数字ID"] == id)) {
                return itemlist1.find(x => x["数字ID"] == id)["物品ID"]
            }
            else {
                return null
            }
        }
        function getSkill(id) {
            if (skilllist.find(x => x["数字ID"] == id)) {
                return skilllist.find(x => x["数字ID"] == id)["技能ID"]
            }
            else {
                return null
            }
        }
        function getQuest(id) {
            const questlist1 = JsonUtil.deserialize(VFS.readFile(`${ModPath}任务索引表.json`));
            if (questlist1.find(x => x["数字ID"] == id)) {
                return questlist1.find(x => x["数字ID"] == id)["任务ID"]
            }
            else {
                return null
            }
        }
        function getTrader(id) {
            const questlist1 = JsonUtil.deserialize(VFS.readFile(`${ModPath}任务索引表.json`));
            if (questlist1.find(x => x["数字ID"] == id)) {
                return questlist1.find(x => x["数字ID"] == id)["商人ID"]
            }
            else {
                return null
            }
        }
        function havePreset(itemid) {
            var Preset = FuncDatabaseServer.getTables().globals.ItemPresets
            for (let ps in Preset) {
                if (Preset[ps]._encyclopedia != null) {
                    if (Preset[ps]._encyclopedia == itemid) {
                        return true
                    }
                }
            }
            return false
        }
        function getPresetBase(itemid) {
            var Preset = FuncDatabaseServer.getTables().globals.ItemPresets
            var PS = []
            for (let ps in Preset) {
                if (Preset[ps]._encyclopedia != null) {
                    if (Preset[ps]._encyclopedia == itemid) {
                        PS.push(Preset[ps]._items[0])
                        for (var i = 1; i < Preset[ps]._items.length; i++) {
                            PS.push(Preset[ps]._items[i])
                        }
                        //console.log("原始id" +Preset[ps]._items[0]._id)
                    }
                }
            }
            return PS
        }
        function getPreset(itemid, num) {
            var PS = JsonUtil.clone(getPresetBase(itemid))
            var Array1 = []
            for (var i = 0; i < PS.length; i++) {
                Array1.push(PS[i])
                //console.log("修改前id" + PS[i]._id)
            }
            for (var i = 0; i < Array1.length; i++) {
                Array1[i]._id = `${Array1[i]._id}_${num}`
                //console.log("修改后id" + PS[i]._id)
                Array1[i].desc = "DESC"
                if (Array1[i].parentId) {
                    Array1[i].parentId = `${Array1[i].parentId}_${num}`
                }
                if (!Array1[i].upd) {
                    Array1[i].upd = {}
                    Array1[i].upd.SpawnedInSession = true
                }
            }
            Array1[0].upd.SpawnedInSession = true
            Array1[0].parentId = "62b997444agc8eb4cb013004"
            Array1[0].slotId = "main"
            return Array1
        }
        var testps = {}
        for (var i = 0; i < 3; i++) {
        }
        //testps[0] = getPreset("5644bd2b4bdc2d3b4c8b4572", 0)
        //testps[1] = getPreset("5644bd2b4bdc2d3b4c8b4572", 1)
        //VFS.writeFile(`${ModPath}TestPreset.json`, JSON.stringify(testps, null, 4))
        process.on('exit', (code) => {
            console.log(`子进程退出，退出码：${code}`);
        });
        //VFS.writeFile(`${ModPath}suit.json`, JSON.stringify(ClientDB.traders["5ac3b934156ae10c4430e83c"].suits, null, 4))
        function GenerateHash(string) {
            const shasum = crypto.createHash("sha1");
            shasum.update(string);
            return shasum.digest("hex").substring(0, 24);
        }
        function CustomLog(string) {
            Logger.logWithColor("[Console]: " + string, "yellow");
        }
        function CustomAccess(string) {
            Logger.logWithColor("[Console]: " + string, "green");
        }
        function CustomDenied(string) {
            Logger.logWithColor("[Console]: " + string, "red");
        }
    }
}
module.exports = { mod: new Mod() }