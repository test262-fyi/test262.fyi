function print(str) {
  Kiesel.print(str);
}

var $262 = {
  global: globalThis,
  gc() {
    return Kiesel.gc.collect();
  },
  createRealm(options) {
    var realm = Kiesel.createRealm();
    realm.eval(this.source);
    realm.$262.source = this.source;
    return realm.$262;
  },
  detachArrayBuffer(buffer) {
    return Kiesel.detachArrayBuffer(buffer);
  },
  evalScript(code) {
    return Kiesel.evalScript(code);
  },
  getGlobal(name) {
    return this.global[name];
  },
  setGlobal(name, value) {
    this.global[name] = value;
  },
  destroy() { /* noop */ },
  IsHTMLDDA: Kiesel.createIsHTMLDDA(),
  source: $SOURCE,
  agent: {},
};