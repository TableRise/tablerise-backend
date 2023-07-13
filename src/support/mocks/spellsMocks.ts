import { Spell } from './../../schemas/spellsValidationSchema';
import generateNewMongoID from '../helpers/generateNewMongoID';
import Mock from 'src/types/Mock';

const spellMockEn: Spell = {
  name: 'Fire ball',
  description: 'Explodes everyone',
  type: 'Fire',
  level: '1',
  higherLevels: [{
    level: '2',
    damage: '20',
    buffs: ['Strength'],
    debuffs: ['Fire']
  }],
  damage: '10',
  castingTime: '1',
  duration: '5',
  range: '25',
  components: ['Fire'],
  buffs: ['Strength'],
  debuffs: ['Fire']
};

const spellMockPt: Spell = {
  name: 'Bola de fogo',
  description: 'Explode todo mundo',
  type: 'Fogo',
  level: '1',
  higherLevels: [{
    level: '2',
    damage: '20',
    buffs: ['Força'],
    debuffs: ['Fogo']
  }],
  damage: '10',
  castingTime: '1',
  duration: '5',
  range: '25',
  components: ['Fogo'],
  buffs: ['Força'],
  debuffs: ['Fogo']
};

const spell: Mock = {
  instance: {
    _id: generateNewMongoID(),
    en: spellMockEn,
    pt: spellMockPt
  },
  description: 'Mock an instance of a RPG spell'
}

export default spell;
