import { typeHelper } from "..";

export type FnQueueItemType = Function
class PromisifyFnQueue {
  queue: FnQueueItemType[]
  
  addQueueItem = (itemFn: FnQueueItemType) => {
    if (!typeHelper.isPromise(itemFn)) {
      const args = itemFn.arguments
      itemFn = () => new Promise((resolve) => { resolve(itemFn(...args)) })
    }
    this.queue.push(itemFn)
  }
  
  removeQueueItem = (names?: string[]): void => {
    if (this.queue.length < 1) return
    // 不传则默认删除第一个
    if (!names) {
      this.queue.pop()
      return
    }
    // 根据函数名来删除队列中的项，但不建议使用，违反队列原则
    names.map(name => {
      const deleteIdx = this.queue.findIndex(item => item.name === name)
      return deleteIdx !== -1 ? this.queue.splice(deleteIdx, 1)[0] : false
    })
  }

  constructor(queue: FnQueueItemType[] = []) {
    this.queue = typeof queue === 'function' ? [queue] : queue;
  }
}
export interface PromisifyFnQueueType extends PromisifyFnQueue {}

export { PromisifyFnQueue }