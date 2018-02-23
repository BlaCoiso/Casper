
// Module Docs___________________________
// | Type: MANAGER
// | Function: Generate/Update the Config
// |_____________________________________

const configVersion = 7;
let cfgModules = [];
module.exports = {
    checkUpdates(DB, botConf) {
        try {
            if (!DB.readValue("generated")) return true;
            let version = DB.readValue("version");
            if (DB.readValue("prefix") == botConf.prefix) DB.saveValue("prefix", "");
            if (version != configVersion) return true;
            else {
                let needsUpdate = false;
                let moduleData = DB.readValue("moduleData");
                for (let module of cfgModules) {
                    let modData = moduleData[module.name];
                    if (!modData || module.checkConfUpdates(modData)) {
                        needsUpdate = true;
                        break;
                    }
                }
                return needsUpdate;
            }
        } catch (e) {
            console.error("[CfgGen]: " + e.name + " while generating config: " + e.stack);
            return true;
        }
    },
    generateConfig(cfg, botConf) {
        try {
            const currentData = cfg.getData();
            let moduleData = currentData.moduleData;
            for (let module of cfgModules) {
                moduleData[module.name] = module.generateConfig((moduleData[module.name] || {}), cfg.guild);
            }
            cfg.saveValue("name", cfg.guild.name); //Is this really needed?
            cfg.saveValue("lastUpdatedTS", Date.now());
            cfg.saveValue("generated", true);
            cfg.initValue("blacklisted", false);
            cfg.initValue("modRoles", []);
            cfg.initValue("adminRoles", []);
            cfg.initValue("modPerms", []);
            cfg.initValue("blacklist", []);
            cfg.initValue("adminBypass", false);
            if (cfg.readValue("version") == 6) cfg.saveValue("blacklist", []); //Patch cfg v6
            cfg.initValue("timedTasks", []);
            cfg.saveValue("version", configVersion);
            return cfg;
        } catch (e) {
            console.error(`[CfgGen]: Can't save config: ${e.stack}`);
        }
    },
    registerModuleCfg(module) {
        if (module && module.name && module.needsConfig && module.generateConfig && module.checkConfUpdates) {
            let exists = false;
            for (let mod of cfgModules) {
                if (mod.name == module.name) {
                    mod = module;
                    exists = true;
                    break;
                }
            }
            if (!exists) cfgModules.push(module);
        }
    }
}