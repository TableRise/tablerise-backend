import { Request, Response } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import { FileObject } from 'src/types/shared/file';
import parseRequestJsonField from 'src/interface/common/helpers/parseRequestJsonField';
import { TCreateCharacterBody } from './CharactersSchemas';

export default class CharactersController {
    private readonly createCharacterOperation;
    private readonly getAllCharactersOperation;
    private readonly getCharacterByIdOperation;
    private readonly updateCharacterOperation;
    private readonly updateCharacterPictureOperation;
    private readonly addEquipmentOperation;
    private readonly removeEquipmentOperation;
    private readonly updateCharacterMoneyOperation;
    private readonly deleteCharacterOperation;

    constructor({
        createCharacterOperation,
        getAllCharactersOperation,
        getCharacterByIdOperation,
        updateCharacterOperation,
        updateCharacterPictureOperation,
        addEquipmentOperation,
        removeEquipmentOperation,
        updateCharacterMoneyOperation,
        deleteCharacterOperation,
    }: InterfaceDependencies['charactersControllerContract']) {
        this.createCharacterOperation = createCharacterOperation;
        this.getAllCharactersOperation = getAllCharactersOperation;
        this.getCharacterByIdOperation = getCharacterByIdOperation;
        this.updateCharacterPictureOperation = updateCharacterPictureOperation;
        this.updateCharacterOperation = updateCharacterOperation;
        this.addEquipmentOperation = addEquipmentOperation;
        this.removeEquipmentOperation = removeEquipmentOperation;
        this.updateCharacterMoneyOperation = updateCharacterMoneyOperation;
        this.deleteCharacterOperation = deleteCharacterOperation;

        this.createCharacter = this.createCharacter.bind(this);
        this.getById = this.getById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.updateCharacterPicture = this.updateCharacterPicture.bind(this);
        this.updateCharacter = this.updateCharacter.bind(this);
        this.addEquipment = this.addEquipment.bind(this);
        this.removeEquipment = this.removeEquipment.bind(this);
        this.updateCharacterMoney = this.updateCharacterMoney.bind(this);
        this.turnOffNotifications = this.turnOffNotifications.bind(this);
        this.deleteCharacter = this.deleteCharacter.bind(this);
    }

    public async createCharacter(req: Request, res: Response): Promise<Response> {
        const payload = req.body as TCreateCharacterBody;
        const { userId } = req.user as Express.User;

        const result = await this.createCharacterOperation.execute({ payload, userId });
        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getCharacterByIdOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateCharacter(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const payload = req.body;

        const result = await this.updateCharacterOperation.execute({
            characterId: id,
            payload,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this.getAllCharactersOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateCharacterPicture(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;
        const result = await this.updateCharacterPictureOperation.execute({
            characterId: id,
            userId,
            image: req.file as FileObject | undefined,
            imageObject: parseRequestJsonField(req.body?.imageObject),
        });

        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async addEquipment(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { equipmentId } = req.query as { equipmentId: string };

        const result = await this.addEquipmentOperation.execute({ characterId: id, equipmentId });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async removeEquipment(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { equipmentId } = req.query as { equipmentId: string };

        const result = await this.removeEquipmentOperation.execute({ characterId: id, equipmentId });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateCharacterMoney(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { operation, money, moneyType } = req.body;
        const result = await this.updateCharacterMoneyOperation.execute({
            characterId: id,
            operation,
            money,
            moneyType,
        });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async turnOffNotifications(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const result = await this.updateCharacterOperation.execute({
            characterId: id,
            payload: {
                data: {
                    profile: {
                        notificationOn: false,
                    },
                },
            },
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async deleteCharacter(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;

        await this.deleteCharacterOperation.execute({
            characterId: id,
            userId,
        });

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }
}
