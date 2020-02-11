import {
  observable,
  action
} from 'mobx';

export default class historyStore {
  @observable history;

  @action.bound
  setHistory(history) {
    this.history = history;
  }
}