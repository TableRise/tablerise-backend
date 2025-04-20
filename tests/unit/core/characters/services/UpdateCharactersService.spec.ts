import sinon from 'sinon';
import UpdateCharacterService from 'src/core/characters/services/UpdateCharacterService';
import DomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';

describe('Core :: Characters :: Services :: UpdateCharacterService', () => {
    let updateCharacterService: UpdateCharacterService,
        charactersRepository: any,
        character: any,
        result: any,
        payload: any;

    const logger = (): void => {};

    context('#update', () => {
        context('When all characters are successfully updated - without props', () => {
            const createdAttest = new Date().toISOString();

            before(() => {
                [character] = DomainDataFaker.generateCharactersJSON();

                payload = {
                    data: { ...character.data },
                    createdAt: createdAttest,
                    updatedAt: createdAttest,
                };

                payload.data.profile.name = 'some name';

                result = {
                    ...character,
                    data: {
                        ...character.data,
                        profile: {
                            ...character.data.profile,
                            name: payload.data.profile.name,
                        },
                    },
                };

                charactersRepository = {
                    update: sinon.spy(() => result),
                    findOne: sinon.spy(() => character),
                };

                updateCharacterService = new UpdateCharacterService({
                    charactersRepository,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const charactersTest = await updateCharacterService.update({
                    characterId: '112',
                    payload,
                });
                expect(charactersRepository.findOne).to.have.been.called();
                expect(charactersRepository.update).to.have.been.called();
                expect(charactersTest.data.profile.name).to.be.deep.equal('some name');
            });
        });

        context('When all characters are successfully updated - without props', () => {
            const createdAttest = new Date().toISOString();

            before(() => {
                [character] = DomainDataFaker.generateCharactersJSON();

                delete character.data.profile.characteristics;
                delete character.data.stats.hitPoints;
                delete character.data.stats.deathSaves;
                delete character.data.stats.spellCasting;

                payload = {
                    data: { ...character.data },
                    createdAt: createdAttest,
                    updatedAt: createdAttest,
                };

                payload.data.profile.name = 'some name';

                result = {
                    ...character,
                    data: {
                        ...character.data,
                        profile: {
                            ...character.data.profile,
                            name: payload.data.profile.name,
                        },
                    },
                };

                charactersRepository = {
                    update: sinon.spy(() => result),
                    findOne: sinon.spy(() => character),
                };

                updateCharacterService = new UpdateCharacterService({
                    charactersRepository,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const charactersTest = await updateCharacterService.update({
                    characterId: '112',
                    payload,
                });
                expect(charactersRepository.findOne).to.have.been.called();
                expect(charactersRepository.update).to.have.been.called();
                expect(charactersTest.data.profile.name).to.be.deep.equal('some name');
            });
        });
    });
});
