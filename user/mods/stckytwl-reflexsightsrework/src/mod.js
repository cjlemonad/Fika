"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReflexSightRework {
    postSptLoad(container) {
        // get the logger from the server container
        const logger = container.resolve("WinstonLogger");
        logger.info("Loading: ReflexSightRework bundles...");
    }
}
module.exports = { mod: new ReflexSightRework() };
//# sourceMappingURL=mod.js.map