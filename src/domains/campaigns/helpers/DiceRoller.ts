import newUUID from 'src/domains/common/helpers/newUUID';

interface DiceTerm {
    type: 'dice' | 'modifier';
    sign: 1 | -1;
    count?: number;
    sides?: number;
    value?: number;
}

export interface DiceRollResult {
    rollId: string;
    notation: string;
    rolls: number[];
    total: number;
}

const TERM_PATTERN = /([+-]?[^+-]+)/g;
const DICE_PATTERN = /^([+-]?)(\d*)d(\d+)$/i;
const MODIFIER_PATTERN = /^([+-]?)(\d+)$/;

const parseDiceTerm = (term: string): DiceTerm => {
    const normalizedTerm = term.trim();
    const diceMatch = normalizedTerm.match(DICE_PATTERN);

    if (diceMatch) {
        return {
            type: 'dice',
            sign: diceMatch[1] === '-' ? -1 : 1,
            count: diceMatch[2] ? Number(diceMatch[2]) : 1,
            sides: Number(diceMatch[3]),
        };
    }

    const modifierMatch = normalizedTerm.match(MODIFIER_PATTERN);

    if (modifierMatch) {
        return {
            type: 'modifier',
            sign: modifierMatch[1] === '-' ? -1 : 1,
            value: Number(modifierMatch[2]),
        };
    }

    throw new Error(`Unsupported dice notation term: ${term}`);
};

const rollDie = (sides: number): number => Math.floor(Math.random() * sides) + 1;

export const rollDiceNotation = (notation: string): DiceRollResult => {
    const terms = notation.match(TERM_PATTERN);

    if (!terms?.length) {
        throw new Error('Dice notation is empty');
    }

    const parsedTerms = terms.map(parseDiceTerm);
    const rolls: number[] = [];
    let total = 0;

    parsedTerms.forEach((term) => {
        if (term.type === 'modifier') {
            total += term.sign * (term.value as number);
            return;
        }

        for (let index = 0; index < (term.count as number); index += 1) {
            const result = rollDie(term.sides as number);
            rolls.push(result);
            total += term.sign * result;
        }
    });

    return {
        rollId: newUUID(),
        notation,
        rolls,
        total,
    };
};
