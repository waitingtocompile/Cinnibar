// type shim for nodejs' `require()` syntax
// for stricter node.js typings, remove this and install `@types/node`
declare const require: (module: string) => any;


// add your custom typings here

type LogLevel = "ERROR"|"WARN"|"INFO"|"DEBUG";

type ProcessInit = {parent:number, processType:ProcessType, initialData:any};
type ProcessInfo = {readonly pID:number, readonly parent:number, readonly processType:ProcessType, data:any};

type ProcessType = "roomMonitor";


//Tasks
type Task = TaskInitProcess | TaskSimpleProcessOp;

interface TaskInitProcess {taskType:"pInit"; taskData:ProcessInit;}
interface TaskSimpleProcessOp {taskType: "pTerm" | "pSuspend" | "pResume" | "pKill"; taskData:number;}

//End Tasks
