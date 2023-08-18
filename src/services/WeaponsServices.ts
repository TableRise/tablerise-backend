import WeaponsModel from 'src/database/models/WeaponsModel';
import Service from 'src/types/Service';
import weaponsZodSchema, { Weapon } from 'src/schemas/weaponsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';
import UpdateResponse from 'src/types/UpdateResponse';
import ValidateData from 'src/support/helpers/ValidateData';
import { ErrorMessage } from 'src/support/helpers/errorMessage';

export default class WeaponsServices implements Service<Internacional<Weapon>> {
    constructor(
        private readonly _model: WeaponsModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<Weapon>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All weapon entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Weapon>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All weapon entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Weapon>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Weapon entity found with success');
        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);

        return response as Internacional<Weapon>;
    }

    public async update(_id: string, payload: Internacional<Weapon>): Promise<Internacional<Weapon>> {
        this._validate.entry(languagesWrapper(weaponsZodSchema), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Weapon entity updated with success');
        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);

        return response as Internacional<Weapon>;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);

        this._validate.existance(response?.active === query, ErrorMessage.BAD_REQUEST);

        if (response) response.active = query;
        await this._model.update(_id, response as Internacional<Weapon>);

        const responseMessage = {
            message: `Weapon ${response?._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', 'Weapon entity availability updated with success');
        return responseMessage;
    }
}
