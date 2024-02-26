export interface charactersDnd5e {
    characterID: string;
    campaignID: string;
    author: Author;
    data: Data;
    npc: boolean;
    picture: string;
    createdAt: string;
    updatedAt: string;
}

export interface Author {
    userId: string;
    nickname: string;
    fullname: string;
}

export interface Data {
    profile: Profile;
    stats: Stats;
    attacks: Attack;
    equipments: [string];
    money: Money;
    features: [string];
    spells: Spells;
    createdAt: string;
    updatedAt: string;
}

export interface Profile {
    name: string;
    class: string;
    race: string;
    level: number;
    xp: number;
    characteristics: Characteristics;
}

export interface Attack {
    name: string;
    atkBonus: number;
    damage: Damage;
}

export interface Damage {
    type: string;
    bonus: number;
    dice: string;
}

export interface Money {
    cp: number;
    sp: number;
    ep: number;
    gp: number;
    pp: number;
}

export interface Spells {
    cantrips: [string];
    1: SpellLv;
    2: SpellLv;
    3: SpellLv;
    4: SpellLv;
    5: SpellLv;
    6: SpellLv;
    7: SpellLv;
    8: SpellLv;
    9: SpellLv;
}

export interface SpellLv {
    spellIds: [string];
    slotsTotal: number;
    slorsExpanded: number;
}

export interface Characteristics {
    alignment: string;
    backstory: string;
    personality_traits: string;
    ideal: string;
    bonds: string;
    flaws: string;
    appearence: Appearence;
    alliesAndorgs: AlliesAndOrgs;
    other: Other;
    treasure: [string];
}

export interface Appearence {
    eyes: string;
    age: string;
    weight: string;
    height: string;
    skin: string;
    hair: string;
    picture: string;
}

export interface AlliesAndOrgs {
    orgName: string;
    symbol: string;
    content: string;
}

export interface Other {
    languages: [string];
    proficiences: string;
    extraCharacteristics: string;
}

export interface Stats {
    abilityScores: AbilityScore;
    skills: Skills;
    proficiencyBonus: number;
    inspiration: number;
    passiveWisdom: number;
    speed: number;
    initiative: number;
    armorClass: number;
    hitPoints: HitPoints;
    death_saves: DeathSaves;
    spellCasting: SpellCasting;
}

export interface Skills {
    xDinamyc: number;
}

export interface HitPoints {
    points: number;
    currentPoints: number;
    tempPoints: number;
    dicePoints: number;
}

export interface DeathSaves {
    sucess: number;
    failures: number;
}

export interface SpellCasting {
    class: string;
    ability: string;
    saveDc: number;
    attackBonus: number;
}

export interface AbilityScore {
    ability: string;
    value: number;
    modifier: number;
    proficiency: boolean;
}
