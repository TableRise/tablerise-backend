import { DnDWiki, MongoModel, Internacional, SchemasDnDType } from '@tablerise/database-management';
import Service from 'src/types/Service';
import ValidateData from 'src/support/helpers/ValidateData';
import { Logger } from 'src/types/Logger';
import { errorMessage } from 'src/support/helpers/errorMessage';
import UpdateResponse from 'src/types/UpdateResponse';

export default class WikisServices implements Service<Internacional<DnDWiki>> {
    constructor(
        private readonly _model: MongoModel<Internacional<DnDWiki>>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasDnDType
    ) {}

    public async findAll(): Promise<Array<Internacional<DnDWiki>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All wiki entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<DnDWiki>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Wiki entity found with success');
        return this._validate.response(response, errorMessage.notFound.wiki);
    }

    public async findAllDisabled(): Promise<Array<Internacional<DnDWiki>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All wiki entities found with success');
        return response;
    }

    public async update(_id: string, payload: Internacional<DnDWiki>): Promise<Internacional<DnDWiki>> {
        const { helpers, wikiZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(wikiZod), payload);

        this._validate.active(payload.active, errorMessage.badRequest.default.payloadActive);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Wiki entity updated with success');
        return this._validate.response(response, errorMessage.notFound.wiki);
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        let response = await this._model.findOne(_id);

        response = this._validate.response(response, errorMessage.notFound.wiki);

        this._validate.active(response.active === query, errorMessage.badRequest.default.responseActive(query));

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Wiki ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', 'Wiki entity availability updated with success');
        return responseMessage;
    }
}
