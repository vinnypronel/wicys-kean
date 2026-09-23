import { makeRouteHandler } from '@keystatic/next/route-handler';

import keystaticConfig from '../../../../keystatic.config';

const { GET, POST } = makeRouteHandler({
  config: keystaticConfig,
});

export { GET, POST };
