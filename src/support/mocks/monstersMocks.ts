import { Monster } from "./../../schemas/monstersValidationSchema";
import generateNewMongoID from "../helpers/generateNewMongoID";
import Mock from "src/types/Mock";

const monsterMockEn: Monster = {
  name: "Cthulu",
  characteristics: [],
  stats: {
    armorClass: 2,
    hitPoints: {
      hitDice: "1d6",
      hitPointsAtFirstLevel: "1d6",
      hitPointsAtHigherLevels: "1d6",
    },
    speed: 9,
    savingThrows: [],
    damageImmunity: [],
    statusImmunity: [],
    senses: [],
    skillProficiences: [],
    languages: [],
    challangeLevel: 10,
  },
  abilityScore: [],
  skills: [],
  actions: [],
  picture: "https://img.db.com",
};

const monsterMockPt: Monster = {
  name: "Cthulu",
  characteristics: [],
  stats: {
    armorClass: 2,
    hitPoints: {
      hitDice: "1d6",
      hitPointsAtFirstLevel: "1d6",
      hitPointsAtHigherLevels: "1d6",
    },
    speed: 9,
    savingThrows: [],
    damageImmunity: [],
    statusImmunity: [],
    senses: [],
    skillProficiences: [],
    languages: [],
    challangeLevel: 10,
  },
  abilityScore: [],
  skills: [],
  actions: [],
  picture: "https://img.db.com",
};

const monster: Mock = {
  instance: {
    _id: generateNewMongoID(),
    en: monsterMockEn,
    pt: monsterMockPt,
  },
  description: "Mock an instance of a RPG monster",
};

export default monster;
