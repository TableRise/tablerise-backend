import Sinon from 'sinon';
import UpdateCharacterOperation from 'src/core/characters/operations/UpdateCharacterOperation';

describe('Core :: Characters :: Operations :: UpdateCharacterOperation', () => {
    let updateCharacterOperation: UpdateCharacterOperation, payloadToUpdate: any, updateCharacterService: any;

    const logger = (): void => {};
    let socketIO: any;

    beforeEach(() => {
        socketIO = { emitToCampaign: Sinon.spy() } as any;
    });

    context('#execute', () => {
        context('When character are successfully updated', () => {
            beforeEach(() => {
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

        context('When the updated character belongs to a campaign', () => {
            beforeEach(() => {
                updateCharacterService = {
                    update: Sinon.spy(() => ({
                        characterId: '123',
                        campaignId: 'campaign-1',
                        updatedAt: '2026-05-25T12:00:00.000Z',
                        data: {
                            profile: {
                                level: 2,
                            },
                            stats: {
                                hitPoints: {
                                    currentPoints: 8,
                                },
                            },
                        },
                    })),
                };

                payloadToUpdate = {
                    characterId: '123',
                    payload: {
                        data: {
                            profile: {
                                level: 2,
                            },
                            stats: {
                                hitPoints: {
                                    currentPoints: 8,
                                },
                            },
                            inventory: ['rope'],
                        },
                    },
                };

                updateCharacterOperation = new UpdateCharacterOperation({
                    updateCharacterService,
                    socketIO,
                    logger,
                });
            });

            it('should emit the character update event with flattened updated fields', async () => {
                await updateCharacterOperation.execute(payloadToUpdate);

                expect(socketIO.emitToCampaign).to.have.been.calledWith('campaign-1', 'character:updated', {
                    characterId: '123',
                    campaignId: 'campaign-1',
                    updatedFields: ['profile.level', 'stats.hitPoints.currentPoints', 'inventory'],
                    summary: {
                        currentHitPoints: 8,
                        level: 2,
                    },
                    updatedAt: '2026-05-25T12:00:00.000Z',
                });
            });
        });

        it('should emit null summary values when level or hit points are missing', async () => {
            updateCharacterService = {
                update: Sinon.stub().resolves({
                    characterId: '123',
                    campaignId: 'campaign-1',
                    updatedAt: '2026-05-25T12:00:00.000Z',
                    data: {
                        profile: {},
                        stats: {
                            hitPoints: {},
                        },
                    },
                }),
            };

            updateCharacterOperation = new UpdateCharacterOperation({
                updateCharacterService,
                socketIO,
                logger,
            });

            await updateCharacterOperation.execute({
                characterId: '123',
                payload: {
                    data: {},
                },
            } as any);

            expect(socketIO.emitToCampaign).to.have.been.calledWith(
                'campaign-1',
                'character:updated',
                Sinon.match.has('summary', {
                    currentHitPoints: null,
                    level: null,
                })
            );
        });
    });
});
