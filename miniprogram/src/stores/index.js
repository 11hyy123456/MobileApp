class Store {
  constructor() {
    this.observables = {};
    this.subscribers = [];
  }

  observe(key, initialValue) {
    this.observables[key] = {
      value: initialValue,
      subscribers: []
    };
  }

  set(key, value) {
    if (this.observables[key]) {
      this.observables[key].value = value;
      this.notifySubscribers(key);
    }
  }

  get(key) {
    return this.observables[key] ? this.observables[key].value : undefined;
  }

  subscribe(key, callback) {
    if (this.observables[key]) {
      this.observables[key].subscribers.push(callback);
    }
  }

  notifySubscribers(key) {
    if (this.observables[key]) {
      this.observables[key].subscribers.forEach(cb => cb(this.observables[key].value));
    }
  }

  bindContext(page) {
    const proxy = {};
    Object.keys(this.observables).forEach(key => {
      const self = this;
      Object.defineProperty(proxy, key, {
        get: () => self.get(key),
        set: (value) => self.set(key, value),
        configurable: true
      });
    });
    page.setData(proxy);
  }
}

const userStore = new Store();

userStore.observe('isLoggedIn', false);
userStore.observe('userInfo', null);
userStore.observe('token', null);

const noteStore = new Store();

noteStore.observe('notes', []);
noteStore.observe('currentNote', null);
noteStore.observe('categories', []);
noteStore.observe('tags', []);
noteStore.observe('dueReviews', []);
noteStore.observe('loading', false);

module.exports = {
  userStore,
  noteStore
};
