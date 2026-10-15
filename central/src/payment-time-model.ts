/** A planning model for request preparation, never a measured usability result. */
export const defaultTimeAssumptions = {
  commonSeconds: 90,
  topUpSeconds: 120,
  sourceSeconds: 10,
  connectionSeconds: 120,
}

export function estimatePreparationTime(
  assumptions: typeof defaultTimeAssumptions,
  paymentsPerTopUp: number,
  firstConnection: boolean,
) {
  if (
    !Number.isFinite(paymentsPerTopUp) ||
    paymentsPerTopUp < 1 ||
    Object.values(assumptions).some(
      (value) => !Number.isFinite(value) || value < 0,
    )
  ) {
    throw new RangeError(
      'Time assumptions must be finite and nonnegative; at least one payment is required.',
    )
  }
  const before =
    assumptions.commonSeconds + assumptions.topUpSeconds / paymentsPerTopUp
  const after =
    assumptions.commonSeconds +
    assumptions.sourceSeconds +
    (firstConnection ? assumptions.connectionSeconds : 0)
  return { before, after, saved: before - after }
}
