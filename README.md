# test262.fyi
test262.report spiritual successor (WIP)

## JS Engines
- [X] V8
- [X] SpiderMonkey (sm)
- [X] JavaScriptCore (jsc)
- [X] ChakraCore (chakra)
- [X] Hermes
- [X] LibJS
- [X] engine262
- [X] GraalJS
- [X] QuickJS (qjs)
- [X] XS
- [ ] Rhino
- [ ] Nashorn
- [ ] V8 stable
- [ ] SM stable
- [ ] JSC stable
- [ ] Hermes stable
- Request more in GitHub issues!

## Features to do
- Preview test262 PRs (changes only)
- Data/graph over time

## Local build
1. Clone repo
2. `./scripts/downloadResults.sh` (downloads results from latest build)
3. `node site/generate.mjs` (might take a minute or two)
4. Start a HTTP server in `site` and open it in your browser
