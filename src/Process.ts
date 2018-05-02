import {IProcessPrototype} from "./IProcessPrototype";
import {log} from "./utils/Logger";

class nopProcessPrototype implements IProcessPrototype{
  init(context:number):void{}
  run(context:number):boolean{return false;}
  term(context:number):void{}
  validateInitialMemory(data:any):boolean{return false;}
}

export class Process{
  public readonly processInfo:ProcessInfo;
  public suspended:boolean;

  static readonly nopProcess:IProcessPrototype = new nopProcessPrototype();
  static readonly processTypeInterface:{[key:string]:IProcessPrototype} = {
      //Anything here should be recognised in types.d.ts::ProcessType

    };

  public static validateCandidateProcess(processInfo:ProcessInit)
  {
    if(typeof this.processTypeInterface[processInfo.processType as string] == "undefined") return false;
    return this.processTypeInterface[processInfo.processType as string].validateInitialMemory(processInfo.initialData);
  }

  public constructor(pID: number, processInit:ProcessInit) {
    this.processInfo = {pID: pID, parent: processInit.parent, processType: processInit.processType, data: processInit.initialData};
    this.suspended = false;
  }

  private getProcessPrototype():IProcessPrototype {
    let found = Process.processTypeInterface[<string>this.processInfo.processType];
    if(typeof found == "undefined")
    {
      log.error("Invalid process type " + <string>this.processInfo.processType + " with pID " + this.processInfo.pID + "sought");
      return Process.nopProcess;
    }
    else return found;
  }

  public init():void {
    this.getProcessPrototype().init(this.processInfo.pID);
  }

  public run():boolean{
    if(this.suspended) return true;
    return this.getProcessPrototype().run(this.processInfo.pID);
  }

  public terminate():void {
    return this.getProcessPrototype().term(this.processInfo.pID);
  }




}

