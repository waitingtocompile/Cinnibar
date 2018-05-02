export interface IProcessPrototype {
  init(context:number):void;
  run(context:number):boolean;
  term(context:number):void;
  validateInitialMemory(data:any):boolean;
}
