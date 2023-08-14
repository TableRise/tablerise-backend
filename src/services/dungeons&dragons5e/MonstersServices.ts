import MonstersModel from 'src/database/models/dungeons&dragons5e/MonstersModel';
import Service from 'src/types/Service';
import monstersZodSchema, { Monster } from 'src/schemas/dungeons&dragons5e/monstersValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import ValidateData from 'src/support/helpers/ValidateData';
import { LoggerType } from 'src/types/LoggerType';
import { errorMessage } from 'src/support/helpers/errorMessage';
import UpdateResponse from 'src/types/UpdateResponse';

export default class MonstersService implements Service<Internacional<Monster>> {
    constructor(
        private readonly _model: MonstersModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<Monster>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All monster entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Monster>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Monster entity found with success');
        return this._validate.response(response, errorMessage.notFound.monster);
    }

    public async findAllDisabled(): Promise<Array<Internacional<Monster>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All Monster entities found with success');
        return response;
    }

    public async update(_id: string, payload: Internacional<Monster>): Promise<Internacional<Monster>> {
        this._validate.entry(languagesWrapper(monstersZodSchema), payload);

        this._validate.active(payload.active, errorMessage.badRequest.default.payloadActive);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Monster entity updated with success');
        return this._validate.response(response, errorMessage.notFound.monster);
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        let response = await this._model.findOne(_id);

        response = this._validate.response(response, errorMessage.notFound.monster);

        this._validate.active(response.active === query, errorMessage.badRequest.default.responseActive(query));

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Monster ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', 'Monster entity availability updated with success');
        return responseMessage;
    }
}
