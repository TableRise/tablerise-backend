import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import CharacterDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import UsersDomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import AddEquipmentService from 'src/core/characters/services/AddEquipmentService';

describe('Core :: Characters :: Services :: AddEquipmentService', () => {
    let addEquipmentService: AddEquipmentService;
    let charactersRepository: any;
    let dungeonsAndDragonsRepository: any;
    let usersDetailsRepository: any;
    let character: any;
    let userDetails: any;

    const logger = (): void => {};

    beforeEach(() => {
        character = CharacterDomainDataFaker.generateCharactersJSON()[0];
        character.data.equipments = [];
        character.author.userId = 'owner-user';
        userDetails = {
            ...UsersDomainDataFaker.generateUserDetailsJSON()[0],
            userDetailId: 'detail-id',
            userId: 'owner-user',
            xp: 0,
            level: 1,
            rank: 'bronze',
            gameInfo: {
                ...UsersDomainDataFaker.generateUserDetailsJSON()[0].gameInfo,
                badges: [],
                userLevelAmount: 0,
            },
        };

        charactersRepository = {
            findOne: sinon.stub().resolves(character),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        dungeonsAndDragonsRepository = {
            setEntity: sinon.stub(),
            findOne: sinon.stub().resolves({
                name: 'Longsword',
                price: [15, 'PO'],
            }),
        };

        usersDetailsRepository = {
            findOne: sinon.stub().resolves(userDetails),
            update: sinon.stub().resolves(userDetails),
        };

        addEquipmentService = new AddEquipmentService({
            charactersRepository,
            dungeonsAndDragonsRepository,
            usersDetailsRepository,
            logger,
        } as any);
    });

    it('should append the looked-up equipment to the character', async () => {
        const result = await addEquipmentService.add({
            characterId: character.characterId,
            equipmentId: 'equipment-1',
            userId: 'owner-user',
        });

        expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith('Equipment');
        expect(result.data.equipments).to.deep.equal([
            {
                name: 'Longsword',
                price: [15, 'PO'],
                equipmentId: 'equipment-1',
            },
        ]);
        expect(usersDetailsRepository.update).to.have.been.calledWith({
            query: { userDetailId: 'detail-id' },
            payload: sinon.match.has('xp', 20).and(sinon.match.has('rank', 'bronze')),
        });
    });

    it('should reject duplicated equipments', async () => {
        character.data.equipments = [{ equipmentId: 'equipment-1' }];

        try {
            await addEquipmentService.add({
                characterId: character.characterId,
                equipmentId: 'equipment-1',
                userId: 'owner-user',
            });
            expect.fail('Expected duplicate equipment error');
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.equal('Equipment already added to character');
            expect(err.code).to.equal(HttpStatusCode.CONFLICT);
            expect(err.name).to.equal(getErrorName(HttpStatusCode.CONFLICT));
        }
    });

    it('should append equipment when the character has no equipments array', async () => {
        character.data.equipments = undefined;

        const result = await addEquipmentService.add({
            characterId: character.characterId,
            equipmentId: 'equipment-2',
            userId: 'owner-user',
        });

        expect(result.data.equipments).to.deep.equal([
            {
                name: 'Longsword',
                price: [15, 'PO'],
                equipmentId: 'equipment-2',
            },
        ]);
    });

    it('should reject when the authenticated user is not the character owner', async () => {
        try {
            await addEquipmentService.add({
                characterId: character.characterId,
                equipmentId: 'equipment-1',
                userId: 'other-user',
            });
            expect.fail('Expected forbidden owner validation');
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.equal('The operation is forbidden for this role');
            expect(err.code).to.equal(HttpStatusCode.BAD_REQUEST);
            expect(err.name).to.equal(getErrorName(HttpStatusCode.BAD_REQUEST));
        }

        expect(usersDetailsRepository.update).to.not.have.been.called();
    });
});
