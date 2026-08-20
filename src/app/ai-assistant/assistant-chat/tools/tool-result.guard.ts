export function withToolResultGuard<TArgs extends unknown[], TResult>(
  toolName: string,
  handler: (...args: TArgs) => TResult | Promise<TResult>
) {
  return async (...args: TArgs): Promise<TResult> => {
    const result = await handler(...args);

    if (result === null || result === undefined) {
      throw new Error(
        `${toolName} must return a non-null tool result to avoid repeated tool calls.`
      );
    }

    return result;
  };
}
