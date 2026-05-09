import Sinon from 'sinon';
import UpdateCharacterOperation from 'src/core/characters/operations/UpdateCharacterOperation';

describe('Core :: Characters :: Operations :: UpdateCharacterOperation', () => {
    let updateCharacterOperation: UpdateCharacterOperation, payloadToUpdate: any, updateCharacterService: any;

    const logger = (): void => {};
    const socketIO = { emitToCampaign: Sinon.spy() } as any;

    context('#execute', () => {
        context('When character are successfully updated', () => {
            before(() => {
                updateCharacterService = {
                    update: Sinon.spy(() => ({
                        characterId: '123',
                        campaignId: null,
                        updatedAt: new Date().toISOString(),
                        data: {
                            profile: {
                                level: 1,
                            },
                            stats: {
                                hitPoints: {
                                    currentPoints: 10,
                                },
                            },
                        },
                    })),
                };

                payloadToUpdate = {
                    characterId: '123',
                    payload: {},
                };

                updateCharacterOperation = new UpdateCharacterOperation({
                    updateCharacterService,
                    socketIO,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                await updateCharacterOperation.execute(payloadToUpdate);
                expect(updateCharacterService.update).to.have.been.called();
            });
        });
    });
});
