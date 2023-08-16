import { DnDWeapon, MongoModel, Internacional, SchemasDnDType } from '@tablerise/database-management';
import Service from 'src/types/Service';
import { Logger } from 'src/types/Logger';
import UpdateResponse from 'src/types/UpdateResponse';
import ValidateData from 'src/support/helpers/ValidateData';
import { errorMessage } from 'src/support/helpers/errorMessage';

export default class WeaponsServices implements Service<Internacional<DnDWeapon>> {
    constructor(
        private readonly _model: MongoModel<Internacional<DnDWeapon>>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasDnDType
    ) {}

    public async findAll(): Promise<Array<Internacional<DnDWeapon>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All weapon entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<DnDWeapon>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All weapon entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<DnDWeapon>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Weapon entity found with success');
        return this._validate.response(response, errorMessage.notFound.weapon);
    }

    public async update(_id: string, payload: Internacional<DnDWeapon>): Promise<Internacional<DnDWeapon>> {
        const { helpers, weaponZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(weaponZod), payload);

        this._validate.active(payload.active, errorMessage.badRequest.default.payloadActive);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Weapon entity updated with success');
        return this._validate.response(response, errorMessage.notFound.weapon);
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        let response = await this._model.findOne(_id);

        response = this._validate.response(response, errorMessage.notFound.weapon);

        this._validate.active(response.active === query, errorMessage.badRequest.default.responseActive(query));

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
