type HitPoints = {
    points?: number;
    currentPoints?: number;
    tempPoints?: number;
    dicePoints?: string;
};

interface ReconcileCharacterHitPointsPayload {
    previousHitPoints?: HitPoints;
    payloadHitPoints?: HitPoints;
    recalculatedHitPoints?: Pick<HitPoints, 'points' | 'currentPoints'>;
}

export default function reconcileCharacterHitPoints({
    previousHitPoints,
    payloadHitPoints,
    recalculatedHitPoints,
}: ReconcileCharacterHitPointsPayload): HitPoints {
    const storedHitPoints = previousHitPoints ?? {};
    const nextPayloadHitPoints = payloadHitPoints ?? {};
    const hitPointsAfterConstitutionRecalculation = {
        ...storedHitPoints,
        ...nextPayloadHitPoints,
        ...(recalculatedHitPoints ?? {}),
    };

    if (typeof nextPayloadHitPoints.points === 'number') {
        const effectiveTempPoints =
            typeof nextPayloadHitPoints.tempPoints === 'number'
                ? nextPayloadHitPoints.tempPoints
                : hitPointsAfterConstitutionRecalculation.tempPoints ?? 0;

        return {
            ...hitPointsAfterConstitutionRecalculation,
            points: nextPayloadHitPoints.points,
            currentPoints: nextPayloadHitPoints.points + effectiveTempPoints,
        };
    }

    if (typeof nextPayloadHitPoints.tempPoints === 'number') {
        const previousCurrentPoints = storedHitPoints.currentPoints ?? 0;
        const previousTempPoints = storedHitPoints.tempPoints ?? 0;
        const baseCurrentPoints = previousCurrentPoints - previousTempPoints;

        return {
            ...hitPointsAfterConstitutionRecalculation,
            currentPoints: baseCurrentPoints + nextPayloadHitPoints.tempPoints,
        };
    }

    return hitPointsAfterConstitutionRecalculation;
}
