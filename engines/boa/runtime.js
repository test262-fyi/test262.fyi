function print() {
  console.log.apply({}, arguments);
}

var $262 = {
  global: globalThis,
  gc() {
    return $boa.gc.collect();
  },
  createRealm(options) {
    options = options || {};
    options.globals = options.globals || {};

    var context = {
      print: print,
    };

    var keys = Object.keys(options.globals);
    for (var i = 0; i < keys.length; i++) {
      context[keys[i]] = options.globals[keys[i]];
    }

    var realm = $boa.realm.create();
    realm.eval(this.source);
    realm.$262.source = this.source;
    realm.$262.context = context;
    realm.$262.destroy = function () {
      if (options.destroy) {
        options.destroy();
      }
    };

    return realm.$262;
  },
  evalScript(code) {
    try {
      eval(code);
      return { type: 'normal', value: undefined };
    } catch (e) {
      return { type: 'throw', value: e };
    }
  },
  getGlobal(name) {
    return this.global[name];
  },
  setGlobal(name, value) {
    this.global[name] = value;
  },
  destroy() { /* noop */ },
  IsHTMLDDA: {},
  source: $SOURCE,
  get agent() {
    throw new Test262Error('agent.* not yet supported.');
  }
};