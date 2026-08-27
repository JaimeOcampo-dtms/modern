/// <reference types="jasmine" />

import { withToolResultGuard } from './tool-result.guard';

describe('withToolResultGuard', () => {
  it('returns the handler result unchanged', async () => {
    const guarded = withToolResultGuard('findFlights', async () => ({
      status: 'ok',
    }));

    const result = await guarded();
    expect(result).toEqual({ status: 'ok' });
  });

  it('throws when handler returns undefined', async () => {
    const guarded = withToolResultGuard('findFlights', async () => undefined);

    let thrown: unknown;
    try {
      await guarded();
      fail('Expected guard to throw for undefined tool result.');
    } catch (error) {
      thrown = error;
    }

    expect((thrown as Error).message).toContain('findFlights');
  });
});
