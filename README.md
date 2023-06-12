# test262.fyi
Independent daily [test262](https://github.com/tc39/test262) (standard test suite) runner for *many* JS engines (test262.report spiritual successor). WIP.

## Engines
- [X] V8 <small>[site](https://v8.dev)</small> <small>[source](https://chromium.googlesource.com/v8/v8.git)</small>
- [X] SpiderMonkey <small>[site](https://spidermonkey.dev)</small> <small>[source](https://hg.mozilla.org/mozilla-central/file/tip/js)</small>
- [X] JavaScriptCore <small>[source](https://github.com/WebKit/WebKit/tree/main/Source/JavaScriptCore)</small>
- [X] ChakraCore <small>[source](https://github.com/chakra-core/ChakraCore)</small>
- [X] Hermes <small>[site](https://hermesengine.dev)</small> <small>[source](https://github.com/facebook/hermes)</small>
- [X] LibJS <small>[site](https://libjs.dev)</small> <small>[source](https://github.com/SerenityOS/serenity/tree/master/Userland/Libraries/LibJS)</small>
- [X] engine262 <small>[site](https://engine262.js.org)</small> <small>[source](https://github.com/engine262/engine262)</small>
- [X] GraalJS <small>[source](https://github.com/oracle/graaljs)</small>
- [X] QuickJS <small>[site](https://bellard.org/quickjs/)</small> <small>[source](https://github.com/facebook/hermes)</small>
- [X] XS <small>[site](https://www.moddable.com/)</small> <small>[source](https://github.com/Moddable-OpenSource/moddable)</small>
- [X] Rhino <small>[site](https://mozilla.github.io/rhino/)</small> <small>[source](https://github.com/mozilla/rhino)</small>
- [X] Nashorn <small>[site](https://openjdk.org/projects/nashorn/)</small> <small>[source](https://github.com/openjdk/nashorn)</small>
- Request more in GitHub issues!

### Transpilers
- [X] Babel (old Node and Babel + core-js)
- [ ] SWC (old Node and SWC + core-js)

### Engine variants
- [ ] V8 --harmony
- [ ] LibJS bytecode
- [ ] Hermes flow parser (?)
- [ ] Stable versions of engines

## Features to do
- Preview test262 PRs (changes only)
- Data/graph over time
- Diff individual engines(/runs)
- Lookup JS runtime version -> JS engine version (Node, Deno, Bun, etc)
- Measure times for each test, have "result view" and "time view"

## Local build
> **Note**:
> You need a GitHub API token (PAT) in your env as `GITHUB_TOKEN`

1. Clone repo
2. Run `scripts/downloadOldResults.mjs` and `scripts/extractResults.sh` (downloads results from latest build)
3. `node site/generate.mjs` (might take a minute or two)
4. Start a HTTP server in `site` and open it in your browser
