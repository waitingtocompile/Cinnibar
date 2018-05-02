class Logger {
  private consoleLoggingLevel:LogLevel = "INFO";
  private storeLoggingLevel:LogLevel = "DEBUG";
  private memMode:boolean = false;
  private memLimit:number = 200;

  constructor()
  {
    if(typeof Memory.logs == "undefined") Memory.logs = [];
  }

  public setConsoleLoggingLevel(level:LogLevel) {
    this.consoleLoggingLevel = level;
  }

  public setStoreLoggingLevel(level:LogLevel) {
    this.storeLoggingLevel = level;
  }

  public setMemMode(mode:boolean)
  {
    this.memMode = mode;
  }

  public setMemLimit(limit:number)
  {
    this.memLimit = limit;
  }

  public purgeAllMemory()
  {
    Memory.logs = [];
  }

  private pushLogToMemory(message:string)
  {
    while(Memory.logs.length >= this.memLimit)
    {
      Memory.logs.shift();
    }
    Memory.logs.push(message)
  }

  public debug(message:string)
  {
    if(this.consoleLoggingLevel == "DEBUG") console.log(Game.time + "[DEBUG]" + message);
    if(this.memMode && this.storeLoggingLevel == "DEBUG") this.pushLogToMemory(Game.time + "[DEBUG]" + message);
  }

  public info(message:string)
  {
    if(this.consoleLoggingLevel == "DEBUG" || this.consoleLoggingLevel == "INFO") console.log(Game.time + "[INFO]" + message);
    if(this.memMode && (this.storeLoggingLevel == "DEBUG" || this.storeLoggingLevel == "INFO")) this.pushLogToMemory(Game.time + "[INFO]" + message);
  }

  public warn(message:string)
  {
    if(this.consoleLoggingLevel != "ERROR") console.log(Game.time + "[WARN]" + message);
    if(this.memMode && this.storeLoggingLevel != "ERROR") this.pushLogToMemory(Game.time + "[WARN]" + message);
  }

  public error(message:string)
  {
    console.log(Game.time + "[ERROR]" + message);
    if(this.memMode) this.pushLogToMemory(Game.time + "[ERROR]" + message);
  }

  public pushCachedLogsToEmail(groupingInterval:number = 0)
  {
    Game.notify(Memory.logs.join("\n"), groupingInterval);
  }
}


export const log = new Logger();
