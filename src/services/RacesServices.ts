import RacesModel from 'src/database/models/RacesModel';
import Service from 'src/types/Service';
import RaceZodSchema, { Race } from 'src/schemas/racesValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import ValidateEntry from 'src/support/helpers/ValidateData';

export default class RacesServices extends ValidateEntry implements Service<Internacional<Race>> {
    constructor(private readonly _model: RacesModel) {
        super();
    }

    public async findAll(): Promise<Array<Internacional<Race>>> {
        const response = await this._model.findAll();
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Race>> {
        const response = await this._model.findOne(_id);

        return this.validateResponse(response, 'Race');
    }

    public async update(_id: string, payload: Internacional<Race>): Promise<Internacional<Race>> {
        this.validate(languagesWrapper(RaceZodSchema), payload);

        const response = await this._model.update(_id, payload);
        return this.validateResponse(response, 'Race');
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

        this.validateResponse(response, 'Race');

        await this._model.delete(_id);
    }
}
