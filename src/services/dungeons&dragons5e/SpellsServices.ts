import { DnDSpell, MongoModel, Internacional, SchemasDnDType } from '@tablerise/database-management';
import Service from 'src/types/Service';
import { Logger } from 'src/types/Logger';
import UpdateResponse from 'src/types/UpdateResponse';
import ValidateData from 'src/support/helpers/ValidateData';
import { errorMessage } from 'src/support/helpers/errorMessage';

export default class SpellsServices implements Service<Internacional<DnDSpell>> {
    constructor(
        private readonly _model: MongoModel<Internacional<DnDSpell>>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasDnDType
    ) {}

    public async findAll(): Promise<Array<Internacional<DnDSpell>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All spell entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<DnDSpell>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All spell entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<DnDSpell>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Spell entity found with success');
        return this._validate.response(response, errorMessage.notFound.spell);
    }

    public async update(_id: string, payload: Internacional<DnDSpell>): Promise<Internacional<DnDSpell>> {
        const { helpers, spellZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(spellZod), payload);

        this._validate.active(payload.active, errorMessage.badRequest.default.payloadActive);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Spell entity updated with success');
        return this._validate.response(response, errorMessage.notFound.spell);
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        let response = await this._model.findOne(_id);

        response = this._validate.response(response, errorMessage.notFound.spell);

        this._validate.active(response.active === query, errorMessage.badRequest.default.responseActive(query));

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Spell ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `Spell availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
