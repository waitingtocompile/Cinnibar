import {log} from "./utils/Logger";
import {ProcessScheduler} from "./ProcessScheduler";

export class Kernel{

  public readonly systemArchVersion:any;
  private isInitialised:boolean;
  private scheduler!:ProcessScheduler;
  private postInitTasks:Task[];

  public constructor(systemArchVersion:any) {
    this.systemArchVersion = systemArchVersion;
    this.isInitialised = false;
    this.postInitTasks = [];
  }

  public init():boolean {


    //remainder should only be run once per bootstrap
    if(this.isInitialised) return true;
    if(typeof Memory.systemArchVersion == "undefined")
    {
      if(!this.runFirstTimeSetup()) return false;
    }
    if(Memory.systemArchVersion != this.systemArchVersion)
    {
      if(!this.updateSystemArch()) return false;
    }

    this.scheduler = new ProcessScheduler();

    this.isInitialised = true;
    for(let i = 0; i < this.postInitTasks.length; i++)
    {
      this.doTask(this.postInitTasks[i]);
    }
    return true;
  }

  private runFirstTimeSetup():boolean {
    if(typeof Memory.loadData == "undefined" || typeof Memory.loadData.roomName == "undefined"){
      log.info("Set a starting room in Memory.loadData.roomName");
      return false;
    }

    Memory.system = {pCount: 0, pTable: {}, pQueue: [], cpuBufferLevel: 100};
    delete Memory.loadData;
    Memory.systemArchVersion = this.systemArchVersion;
    return true;
  }

  private updateSystemArch():boolean{

    return true;
  }

  public run() {
    // noinspection StatementWithEmptyBodyJS
    while(this.shouldContinue() && this.scheduler.runNext());

  }

  public cleanup() {
    this.scheduler.postOps();
    log.debug("Kernel operations completed for this tick, relinquishing control and awaiting next tick.");
  }

  private shouldContinue():boolean {
    if(!!Game.rooms['sim']) return true; //Always run in sim, there are no limits

    let cpuUsed = Game.cpu.getUsed();
    //If we are extending beyond our normal operational buffer, halt and use the remaining buffer to recover.
    //if(cpuUsed >= Game.cpu.tickLimit - this.cpuBufferLevel) return false;

    return true;
  }

  public doTask(task:Task):number {
    switch (task.taskType) {
      case "pInit":
        return this.scheduler.pInit(task.taskData);
      case "pSuspend":
        this.scheduler.pSuspend(task.taskData);
        return 0;
      case "pResume":
        this.scheduler.pResume(task.taskData);
        return 0;
      case "pTerm":
        this.scheduler.pTerm(task.taskData);
        return 0;
      case "pKill":
        this.scheduler.pKill(task.taskData);
        return 0;

      default:
        log.error("Unknown task executed");
        return -100;
    }

  }
}


export const system = new Kernel("prelim_0.1.0");
