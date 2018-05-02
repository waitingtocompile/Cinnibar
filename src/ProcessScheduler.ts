import {Queue} from "./utils/Queue";
import {Process} from "./Process";
import {log} from "./utils/Logger";

export class ProcessScheduler {
  private mainQueue:Queue<number>;
  private completedQueue:Queue<number>;
  private pTable:Process[];


  public constructor() {
    this.pTable = Memory.system.pTable;
    this.mainQueue = Memory.system.pQueue;
    this.completedQueue = new Queue<number>();
  }

  /**
   * run the next waiting process, if there is one
   * @return {boolean} whether there were any processes to run
   */
  public runNext():boolean {
    if (this.mainQueue.getLength() == 0) return false;
    let running: Process | undefined = this.pTable[this.mainQueue.pop()!];
    if (typeof running == "undefined") return true;

    if (running.run()) {
      this.completedQueue.push(running.processInfo.pID);
    }
    else {
      this.pTerm(running.processInfo.pID);
    }

    return true;
  }

  public pInit(processInfo:ProcessInit):number {
    if(!Process.validateCandidateProcess(processInfo)) return -1;
    let newProcess = new Process(++Memory.system.pCount, processInfo);
    this.pTable[newProcess.processInfo.pID] = newProcess;
    this.mainQueue.push(newProcess.processInfo.pID);
    newProcess.init();
    return newProcess.processInfo.pID;
  }

  public pSuspend(pID:number):void {
    if(typeof this.pTable[pID] == "undefined") log.warn("Attempting to suspend unknown process " + pID);
    else this.pTable[pID].suspended = true;
  }

  public pResume(pID:number):void {
    if(typeof this.pTable[pID] == "undefined") log.warn("Attempting to resume unknown process " + pID);
    else this.pTable[pID].suspended = false;
  }

  public pTerm(pID:number):void {
    if(typeof this.pTable[pID] == "undefined") log.warn("Attempting to terminate unknown process " + pID);
    else {
      this.pTable[pID].terminate();
      this.pKill(pID);
    }
  }

  public pKill(pID:number):void {
    delete Memory.system.pTable[pID];
    delete this.pTable[pID];
  }

  public postOps():void {
    this.mainQueue.concat(this.completedQueue);
    this.completedQueue.clear();

    //make sure all data is saved
  }

}
