import { DnDMagicItem, MongoModel, Internacional, SchemasDnDType } from '@tablerise/database-management';
import Service from 'src/types/Service';
import ValidateData from 'src/support/helpers/ValidateData';
import UpdateResponse from 'src/types/UpdateResponse';
import { Logger } from 'src/types/Logger';
import { errorMessage } from 'src/support/helpers/errorMessage';

export default class MagicItemsServices implements Service<Internacional<DnDMagicItem>> {
    constructor(
        private readonly _model: MongoModel<Internacional<DnDMagicItem>>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasDnDType
    ) {}

    public async findAll(): Promise<Array<Internacional<DnDMagicItem>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All magic item entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<DnDMagicItem>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All magic item entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<DnDMagicItem>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Magic item entity found with success');
        return this._validate.response(response, errorMessage.notFound.magicItem);
    }

    public async update(_id: string, payload: Internacional<DnDMagicItem>): Promise<Internacional<DnDMagicItem>> {
        const { helpers, magicItemZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(magicItemZod), payload);

        this._validate.active(payload.active, errorMessage.badRequest.default.payloadActive);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Magic item entity updated with success');
        return this._validate.response(response, errorMessage.notFound.magicItem);
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        let response = await this._model.findOne(_id);

        response = this._validate.response(response, errorMessage.notFound.magicItem);

        this._validate.active(response.active === query, errorMessage.badRequest.default.responseActive(query));

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Magic Items ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `Magic Item availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
