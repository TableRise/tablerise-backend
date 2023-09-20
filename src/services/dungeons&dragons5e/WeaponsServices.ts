import { MongoModel } from '@tablerise/database-management';
import Service from 'src/types/Service';
import { Logger } from 'src/types/Logger';
import UpdateResponse from 'src/types/UpdateResponse';
import ValidateData from 'src/support/helpers/ValidateData';
import { ErrorMessage } from 'src/support/helpers/errorMessage';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { SchemasDnDType } from 'src/schemas';
import { Weapon } from 'src/schemas/dungeons&dragons5e/weaponsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import HttpRequestErrors from 'src/support/helpers/HttpRequestErrors';
import getErrorName from 'src/support/helpers/getErrorName';

export default class WeaponsServices implements Service<Internacional<Weapon>> {
    constructor(
        private readonly _model: MongoModel<Internacional<Weapon>>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasDnDType
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
        if (!response) throw new HttpRequestErrors({
            message: ErrorMessage.NOT_FOUND_BY_ID,
            code: HttpStatusCode.NOT_FOUND,
            name: getErrorName(HttpStatusCode.NOT_FOUND)
        });

        return response;
    }

    public async update(_id: string, payload: Internacional<Weapon>): Promise<Internacional<Weapon>> {
        const { helpers, weaponZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(weaponZod), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Weapon entity updated with success');
        if (!response) throw new HttpRequestErrors({
            message: ErrorMessage.NOT_FOUND_BY_ID,
            code: HttpStatusCode.NOT_FOUND,
            name: getErrorName(HttpStatusCode.NOT_FOUND)
        });

        return response;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        if (!response) throw new HttpRequestErrors({
            message: ErrorMessage.NOT_FOUND_BY_ID,
            code: HttpStatusCode.NOT_FOUND,
            name: getErrorName(HttpStatusCode.NOT_FOUND)
        });

        this._validate.existance(response.active === query, ErrorMessage.BAD_REQUEST);

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Weapon ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', 'Weapon entity availability updated with success');
        return responseMessage;
    }
}
