export class Queue<T> {
  private list:T[];

  public constructor(initial:T[] = [])
  {
    this.list = initial;
  }

  public push(val:T) {
    this.list.push(val);
  }

  public pop():T|undefined{
    return this.list.shift();
  }

  public concat(queue:Queue<T>) {
    this.list.concat(queue.list);
  }

  public getLength():number {
    return this.list.length;
  }

  public clear(){
    this.list = [];
  }
}
