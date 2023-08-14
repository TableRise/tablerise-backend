import ArmorsModel from 'src/database/models/dungeons&dragons5e/ArmorsModel';
import Service from 'src/types/Service';
import armorsZodSchema, { Armor } from 'src/schemas/dungeons&dragons5e/armorsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';
import UpdateResponse from 'src/types/UpdateResponse';
import { errorMessage } from 'src/support/helpers/errorMessage';
import ValidateData from 'src/support/helpers/ValidateData';

export default class ArmorsServices implements Service<Internacional<Armor>> {
    constructor(
        private readonly _model: ArmorsModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<Armor>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All armor entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Armor>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All armor entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Armor>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Armor entity found with success');
        return this._validate.response(response, errorMessage.notFound.armor);
    }

    public async update(_id: string, payload: Internacional<Armor>): Promise<Internacional<Armor>> {
        this._validate.entry(languagesWrapper(armorsZodSchema), payload);

        this._validate.active(payload.active, errorMessage.badRequest.default.payloadActive);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Armor entity updated with success');
        return this._validate.response(response, errorMessage.notFound.armor);
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        let response = await this._model.findOne(_id);

        response = this._validate.response(response, errorMessage.notFound.armor);

        this._validate.active(response.active === query, errorMessage.badRequest.default.responseActive(query));

        response.active = query;

        await this._model.update(_id, response);

        const responseMessage = {
            message: `Armor ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', 'Armor entity availability updated with success');
        return responseMessage;
    }
}
