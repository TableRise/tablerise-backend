/* eslint-disable @typescript-eslint/ban-ts-comment */
import ArmorsModel from 'src/database/models/ArmorsModel';
import Service from 'src/types/Service';
import armorsZodSchema, { Armor } from 'src/schemas/armorsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';
import UpdateResponse from 'src/types/UpdateResponse';
import { ErrorMessage } from 'src/support/helpers/errorMessage';
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

        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);

        this._logger('info', 'Armor entity updated with success');

        return response as Internacional<Armor>;
    }

    public async update(_id: string, payload: Internacional<Armor>): Promise<Internacional<Armor>> {
        this._validate.entry(languagesWrapper(armorsZodSchema), payload);

        this._validate.active(payload.active, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);
        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);

        this._logger('info', 'Armor entity updated with success');

        return response as Internacional<Armor>;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        let response = await this._model.findOne(_id);

        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);
        // @ts-expect-error
        this._validate.active(response?.active === query, ErrorMessage.CONFLICT(query));

        response = { ...response, active: query } as Internacional<Armor>;

        await this._model.update(_id, response);

        const responseMessage = {
            message: `Armor ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', 'Armor entity availability updated with success');
        return responseMessage;
    }
}
