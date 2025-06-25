import { $, $$ } from '../../utils.js';

export default (file, module = false) => {
  const args = [ './porffor/node_modules/porffor/runtime/index.js', file ];
  if (module) args.push('--module');

  return $$('node', args);
};