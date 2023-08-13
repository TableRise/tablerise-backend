import { Schema } from 'mongoose';
import Connections from 'src/database/DatabaseConnection';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import {
    Race,
    SubRace,
    Characteristic,
    AbilityScoreIncrease,
} from 'src/schemas/dungeons&dragons5e/racesValidationSchema';
import MongoModel from 'src/database/models/MongoModel';

const abilityScoreIncreaseSchema = new Schema<AbilityScoreIncrease>({
    name: { type: String, required: true },
    value: { type: Number, required: true },
});

const characteristicsSchema = new Schema<Characteristic>({
    name: { type: String, required: true },
    description: { type: String, required: true },
});

const subRacesSchema = new Schema<SubRace>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    abilityScoreIncrease: abilityScoreIncreaseSchema,
    characteristics: { type: [characteristicsSchema], required: true },
});

const schema = new Schema<Race>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    abilityScoreIncrease: abilityScoreIncreaseSchema,
    ageMax: { type: Number, required: true },
    alignment: { type: [String], required: true },
    heightMax: { type: Number, required: true },
    speed: { type: [String, Number], required: true },
    language: { type: [String], required: true },
    subRaces: { type: [subRacesSchema], required: true },
    skillProficiences: { type: [String], required: true },
    characterstics: { type: [characteristicsSchema], required: true },
    weightMax: { type: Number, required: true },
});

export const racesMongooseSchema = new Schema<Internacional<Race>>(
    {
        active: { type: Boolean, required: true },
        en: schema,
        pt: schema,
    },
    {
        versionKey: false,
    }
);

const model = Connections['dungeons&dragons5e'].model('race', racesMongooseSchema);

export default class RacesModel extends MongoModel<Internacional<Race>> {
    constructor() {
        super(model);
    }
}
