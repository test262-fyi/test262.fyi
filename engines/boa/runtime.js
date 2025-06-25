function print(str) {
  console.log(str);
}

var $262 = {
  AbstractModuleSource: undefined,
  createRealm() {
    var realm = $boa.realm.create();
    realm.eval($SOURCE);
    return realm.$262;
  },
  detachArrayBuffer: undefined,
  evalScript(code) {
    return eval(code);
  },
  gc() {
    return $boa.gc.collect();
  },
  global: globalThis,
  IsHTMLDDA: undefined,
  agent: undefined,
};