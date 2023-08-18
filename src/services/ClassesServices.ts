import ClassesModel from 'src/database/models/ClassesModel';
import Service from 'src/types/Service';
import classesZodSchema, { Class } from 'src/schemas/classesValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import UpdateResponse from 'src/types/UpdateResponse';
import { LoggerType } from 'src/types/LoggerType';
import ValidateData from 'src/support/helpers/ValidateData';
import { ErrorMessage } from 'src/support/helpers/errorMessage';

export default class ClassesServices implements Service<Internacional<Class>> {
    constructor(
        private readonly _model: ClassesModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<Class>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All class entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Class>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All class entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Class>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Class entity found with success');
        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);
        return response as Internacional<Class>;
    }

    public async update(_id: string, payload: Internacional<Class>): Promise<Internacional<Class>> {
        this._validate.entry(languagesWrapper(classesZodSchema), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const updatedResponse = await this._model.update(_id, payload);

        this._logger('info', 'Class entity updated with success');
        this._validate.response(updatedResponse, ErrorMessage.NOT_FOUND_BY_ID);
        return updatedResponse as Internacional<Class>;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);

        this._validate.existance(response?.active === query, ErrorMessage.BAD_REQUEST);

        if (response) response.active = query;
        await this._model.update(_id, response as Internacional<Class>);

        const responseMessage = {
            message: `Class ${response?._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `Class availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
