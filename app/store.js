class Store {
  constructor() {
    this.data = {
      urls: []
    }
  }
  add(data) {
    this.data.urls.push(data);
  }
  removeFirst() {
    this.data.urls.splice(0, 1);
  }
  get(key) {
    return this.data[key]
  }
  set(key, val) {
    this.data[key] = val
  }
}
module.exports = Store;
