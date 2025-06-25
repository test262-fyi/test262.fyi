import { $, $$ } from '../../utils.js';

export default (file, module = false) => {
  const args = [ '--disable-ansi-colors', '--no-syntax-highlight', '--disable-source-location-hints', '--disable-debug-output', '--use-test262-global', '--disable-string-quotes', file ];
  if (module) args.unshift('-m');

  return $$(`./libjs`, args);
};