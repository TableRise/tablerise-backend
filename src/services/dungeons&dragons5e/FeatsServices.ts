import { MongoModel } from '@tablerise/database-management';
import Service from 'src/types/Service';
import ValidateData from 'src/support/helpers/ValidateData';
import { ErrorMessage } from 'src/support/helpers/errorMessage';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Logger } from 'src/types/Logger';
import UpdateResponse from 'src/types/UpdateResponse';
import { SchemasDnDType } from '@tablerise/database-management/dist/src/schemas';
import { Feat } from 'src/schemas/dungeons&dragons5e/featsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

export default class FeatsServices implements Service<Internacional<Feat>> {
    constructor(
        private readonly _model: MongoModel<Internacional<Feat>>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasDnDType
    ) {}

    public async findAll(): Promise<Array<Internacional<Feat>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All feat entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Feat>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All feat entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Feat>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Feat entity found with success');
        if (!response) throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);

        return response;
    }

    public async update(_id: string, payload: Internacional<Feat>): Promise<Internacional<Feat>> {
        const { helpers, featZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(featZod), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);

        if (!response) throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);
        this._logger('info', 'Feat entity updated with success');
        return response;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        if (!response) throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);

        this._validate.existance(response.active === query, ErrorMessage.BAD_REQUEST);

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Feat ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `Feat availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
