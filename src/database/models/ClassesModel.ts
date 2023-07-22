import { model as mongooseCreateModel, Schema } from 'mongoose';
import { Class } from 'src/schemas/classesValidationSchema';
import MongoModel from 'src/database/models/MongoModel';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const schema = new Schema<Class>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  hitPoints: {
    hitDice: { type: String, required: true },
    hitPointsAtFirstLevel: { type: String, required: true },
    hitPointsAtHigherLevels: { type: String, required: true }
  },
  proficiencies: {
    armor: { type: [String], required: true },
    weapons: { type: [String], required: true },
    tools: { type: [String], required: true },
    savingThrows: { type: [String], required: true },
    skills: { type: [String], required: true }
  },
  equipment: [{
    a: { type: String, required: true },
    b: { type: String, required: true }
  }],
  levelingSpecs: {
    level: { type: [Number], required: true },
    proficiencyBonus: { type: [Number], required: true },
    features: { type: [String], required: true },
    cantripsKnown: {
      isValidToThisClass: { type: Boolean, required: true },
      amount: { type: [Number], required: true }
    },
    spellSlotsPerSpellLevel: {
      isValidToThisClass: { type: Boolean, required: true },
      spellLevel: { type: [Number], required: true },
      spellSpaces: { type: [Number], required: true }
    },
    spellsKnown: {
      isValidToThisClass: { type: Boolean, required: true },
      amount: { type: [Number], required: true }
    },
    kiPoints: {
      isValidToThisClass: { type: Boolean, required: true },
      amount: { type: [Number], required: true }
    },
    martialArts: {
      isValidToThisClass: { type: Boolean, required: true },
      amount: { type: [Number], required: true }
    },
    unarmoredMovement: {
      isValidToThisClass: { type: Boolean, required: true },
      amount: { type: [Number], required: true }
    },
    sneakAttack: {
      isValidToThisClass: { type: Boolean, required: true },
      amount: { type: [Number], required: true }
    },
    sorceryPoints: {
      isValidToThisClass: { type: Boolean, required: true },
      amount: { type: [Number], required: true }
    },
    invocationsKnown: {
      isValidToThisClass: { type: Boolean, required: true },
      amount: { type: [Number], required: true }
    },
    rages: {
      isValidToThisClass: { type: Boolean, required: true },
      amount: { type: [Number], required: true }
    },
    rageDamage: {
      isValidToThisClass: { type: Boolean, required: true },
      amount: { type: [Number], required: true }
    }
  },
  characteristics: [{
    title: { type: String, required: true },
    description: { type: String, required: true }
  }]
});

export const classsMongooseSchema = new Schema<Internacional<Class>>({
  en: schema,
  pt: schema
}, {
  versionKey: false
});

export default class ClasssModel extends MongoModel<Internacional<Class>> {
  constructor(public model = mongooseCreateModel('class', classsMongooseSchema)) {
    super(model)
  }
}
