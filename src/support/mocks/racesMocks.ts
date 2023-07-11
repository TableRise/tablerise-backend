import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import { Race } from 'src/schemas/racesValidationSchema';

import Mock from 'src/types/Mock';

const raceMockEn: Race = {
  name: 'Elf',
  description: `
    Your elf character has a variety of natural abilities 
    the result of thousands of years of elven refinement
    `,
  abilityScoreIncrease: { name: 'Dexterity', value: 2 },
  age: 101,
  alignment: ['Neutral'],
  height: 6,
  speed: 30,
  language: ['commun', 'elvish'],
  subRaces: [{
    name: 'High Elf',
    description: `
      As a high elf, you have a keen mind and a mastery of 
      at least the basics of magic. In many fantasy gaming 
      worlds, there are two kinds of high elves. One type is 
      haughty and reclusive, believing themselves to be 
      superior to non-elves and even other elves. The 
      other type is more common and more friendly, and 
      often encountered among humans and other races.
      `,
    abilityScoreIncrease: { name: 'Intelligence', value: 1 }
  }],
  skillProficiences: ['Perception'],
  characterstics: [{
    name: 'Keen Senses',
    description: 'You have proficiency in the Perception skill.'
  }]
};

const raceMockPt: Race = {
  name: 'Elfo',
  description: `
    Seu personagem elfo tem uma variedade de habilidades naturais
    o resultado de milhares de anos de refinamento élfico
    `,
  abilityScoreIncrease: { name: 'Destreza', value: 2 },
  age: 101,
  alignment: ['Neutro'],
  height: 6,
  speed: 30,
  language: ['comun', 'elfo'],
  subRaces: [{
    name: 'Alto Elfo',
    description: `
      Como um alto elfo, você tem uma mente aguçada e um domínio de
      pelo menos o básico da magia. Em muitos jogos de fantasia
      mundos, existem dois tipos de elfos superiores. Um tipo é
      altivo e recluso, acreditando ser
      superior aos não-elfos e até mesmo a outros elfos. O
      outro tipo é mais comum e mais amigável, e
      freqüentemente encontrados entre humanos e outras raças.
      `,
    abilityScoreIncrease: { name: 'Intelligence', value: 1 }
  }],
  skillProficiences: ['Percepção'],
  characterstics: [{
    name: 'Sentios Aguçados',
    description: 'Você tem proficiência na abilidade percepção.'
  }]
};

const racesMocks: Mock = {
  instance: {
    _id: generateNewMongoID(),
    en: raceMockEn,
    pt: raceMockPt
  },
  description: 'Mock an instance of Item'
};

export default racesMocks;
