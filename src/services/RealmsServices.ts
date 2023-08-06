import RealmsModel from 'src/database/models/RealmsModel';
import Service from 'src/types/Service';
import realmZodSchema, { Realm } from 'src/schemas/realmsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';
import ValidateData from 'src/support/helpers/ValidateData';
import { errorMessage } from 'src/support/helpers/errorMessage';

export default class RealmsServices  implements Service<Internacional<Realm>> {
    constructor(
        private readonly _model: RealmsModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<Realm>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All realm entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Realm>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Realm entity found with success');
        return (this._validate.response(response, errorMessage.notFound.realm));
    }

    public async update(_id: string, payload: Internacional<Realm>): Promise<Internacional<Realm>> {
        this._validate.entry(languagesWrapper(realmZodSchema), payload, errorMessage.notFound.realm);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Realm entity updated with success');
        return (this._validate.response(response, errorMessage.notFound.realm));
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

        this._validate.response(response, errorMessage.notFound.realm);

        await this._model.delete(_id);
    }
}
