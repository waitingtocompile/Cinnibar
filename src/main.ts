import { ErrorMapper } from "utils/ErrorMapper";
import {log} from "./utils/Logger";
import {system} from "./Kernel";


//Perform bootstrapping tasks here.
//This can let us save CPU by only doing certain operations only when the server reloads our scripts

//set logging settings
log.setConsoleLoggingLevel("DEBUG");
log.setMemMode(false);
log.setStoreLoggingLevel("WARN");
log.setMemLimit(200);

if(typeof system !== "undefined") log.debug("Kernel " + system.systemArchVersion + " loaded in");
else log.error("Kernel setup failed");


// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {

  if(!system.init()) {
    log.error("Failed to initialise kernel. Halting early.");
    return;
  }

  system.run();

  system.cleanup();

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
