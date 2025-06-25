function print(str) {
  Kiesel.print(str);
}

var $262 = {
  AbstractModuleSource: undefined,
  createRealm() {
    var realm = Kiesel.createRealm();
    realm.eval($SOURCE);
    return realm.$262;
  },
  detachArrayBuffer(buffer) {
    return Kiesel.detachArrayBuffer(buffer);
  },
  evalScript(code) {
    return Kiesel.evalScript(code);
  },
  gc() {
    return Kiesel.gc.collect();
  },
  global: globalThis,
  IsHTMLDDA: Kiesel.createIsHTMLDDA(),
  agent: undefined,
};