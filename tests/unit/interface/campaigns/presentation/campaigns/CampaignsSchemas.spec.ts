import CampaignsSchemas from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';

describe('Interface :: Campaigns :: Presentation :: Campaigns :: CampaignsSchemas', () => {
    context('When the schemas factory is called', () => {
        it('should return object with all expected schema keys', () => {
            const schemas = CampaignsSchemas();

            expect(schemas).to.have.property('postCreateCampaign');
            expect(schemas).to.have.property('putUpdateCampaign');
            expect(schemas).to.have.property('postAddCampaignPlayers');
            expect(schemas).to.have.property('postCreateCampaignPublishment');
            expect(schemas).to.have.property('postCampaignBuy');
            expect(schemas).to.have.property('patchUpdateCampaignMatchMapImages');
            expect(schemas).to.have.property('patchUpdateCampaignMatchImages');
            expect(schemas).to.have.property('patchHighlightCampaignMatchImage');
            expect(schemas).to.have.property('patchAddCampaignMatchMusics');
            expect(schemas).to.have.property('patchRemoveCampaignMatchMusic');
            expect(schemas).to.have.property('patchEditCampaignMatchMusic');
            expect(schemas).to.have.property('patchUpdateCampaignPlayerCharacter');
            expect(schemas).to.have.property('patchUpdateCampaignJournalHighlight');
            expect(schemas).to.have.property('patchUpdateCampaignJournalPost');
            expect(schemas).to.have.property('patchDeleteCampaignJournalPost');
        });

        it('should validate highlighted journal payload rules', () => {
            const schemas = CampaignsSchemas();
            const validPost = {
                title: 'Session recap',
                author: {
                    userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                    characterIds: [],
                    role: 'dungeon_master',
                    status: 'active',
                },
                content: 'The party reached the ruins.',
                timestamp: new Date().toISOString(),
                category: 'master',
            };

            expect(() =>
                schemas.patchUpdateCampaignJournalHighlight.body.parse({
                    toggle: 'off',
                })
            ).to.not.throw();

            expect(() =>
                schemas.patchUpdateCampaignJournalHighlight.body.parse({
                    toggle: 'on',
                    post: validPost,
                })
            ).to.not.throw();

            expect(() =>
                schemas.patchUpdateCampaignJournalHighlight.body.parse({
                    toggle: 'on',
                })
            ).to.throw();
        });

        it('should require configurations in the create campaign payload', () => {
            const schemas = CampaignsSchemas();
            const basePayload = {
                title: 'Campaign',
                description: 'A short description',
                system: 'dnd5e',
                musics: '[]',
                mainHistory: 'A great adventure begins',
                playerAmountLimit: '4',
                ageRestriction: '16',
            };

            expect(() => schemas.postCreateCampaign.body.parse(basePayload)).to.throw();

            expect(() =>
                schemas.postCreateCampaign.body.parse({
                    ...basePayload,
                    configurations: JSON.stringify({ xpSystem: true, shopSystem: false }),
                })
            ).to.not.throw();

            expect(() =>
                schemas.postCreateCampaign.body.parse({
                    ...basePayload,
                    configurations: { xpSystem: 'true', shopSystem: 'false' },
                })
            ).to.throw();
        });

        it('should validate update and delete journal post payloads', () => {
            const schemas = CampaignsSchemas();

            expect(() =>
                schemas.patchUpdateCampaignJournalPost.query.parse({
                    userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                })
            ).to.not.throw();

            expect(() =>
                schemas.patchUpdateCampaignJournalPost.body.parse({
                    postId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                    title: 'Session recap',
                    post: 'The ruins are open.',
                    category: 'players',
                })
            ).to.not.throw();

            expect(() =>
                schemas.patchDeleteCampaignJournalPost.query.parse({
                    userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                    postId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                })
            ).to.not.throw();
        });

        it('should validate the highlighted match image query', () => {
            const schemas = CampaignsSchemas();

            expect(() =>
                schemas.patchHighlightCampaignMatchImage.query.parse({
                    imageId: 'image-123',
                })
            ).to.not.throw();

            expect(() =>
                schemas.patchHighlightCampaignMatchImage.query.parse({
                    remove: true,
                })
            ).to.not.throw();

            expect(() => schemas.patchHighlightCampaignMatchImage.query.parse({})).to.throw();
            expect(() =>
                schemas.patchHighlightCampaignMatchImage.query.parse({
                    remove: 'true',
                })
            ).to.not.throw();
            expect(() =>
                schemas.patchHighlightCampaignMatchImage.query.parse({
                    remove: 'false',
                })
            ).to.throw();
        });

        it('should validate campaign buy payloads', () => {
            const schemas = CampaignsSchemas();

            expect(() =>
                schemas.postCampaignBuy.body.parse({
                    name: 'Potion',
                    cost: '10 gp',
                    character: 'Lia',
                    user: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                    date: '2026-05-16',
                })
            ).to.not.throw();

            expect(() =>
                schemas.postCampaignBuy.body.parse({
                    name: 'Potion',
                    cost: '10 gp',
                    character: 'Lia',
                    user: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                })
            ).to.throw();
        });

        it('should validate campaign cover and note schemas that remain exposed', () => {
            const schemas = CampaignsSchemas();

            expect(() =>
                schemas.patchUpdateCampaignCover.body.parse({
                    picture: new File(['cover'], 'cover.png', { type: 'image/png' }),
                })
            ).to.not.throw();

            expect(() =>
                schemas.patchUpdateCampaignCover.body.parse({
                    imageObject: JSON.stringify({
                        id: 'cover-1',
                        link: 'https://img.bb/cover',
                        uploadDate: '2026-06-06T00:00:00.000Z',
                        deleteUrl: '',
                        request: { success: true, status: 200 },
                    }),
                })
            ).to.not.throw();

            expect(() =>
                schemas.patchUpdateCampaignPlayerNote.query.parse({
                    title: 'Session Plan',
                })
            ).to.not.throw();

            expect(() =>
                schemas.patchUpdateCampaignPlayerNote.body.parse({
                    content: 'Remember the hidden door',
                })
            ).to.not.throw();
        });

        it('should validate multer-backed campaign image payloads', () => {
            const schemas = CampaignsSchemas();
            const multerFile = {
                fieldname: 'images',
                originalname: 'cover.png',
                mimetype: 'image/png',
                buffer: Buffer.from('cover'),
            };

            expect(() =>
                schemas.patchUpdateCampaignMatchImages.body.parse({
                    images: [multerFile],
                })
            ).to.not.throw();

            expect(() =>
                schemas.patchUpdateCampaignMatchMapImages.body.parse({
                    mapImages: [multerFile],
                })
            ).to.not.throw();

            expect(() =>
                schemas.patchUpdateCampaignMatchImages.body.parse({
                    imageObject: JSON.stringify([
                        {
                            id: 'image-1',
                            link: 'https://img.bb/image',
                            uploadDate: '2026-06-06T00:00:00.000Z',
                            deleteUrl: '',
                            request: { success: true, status: 200 },
                        },
                    ]),
                })
            ).to.not.throw();

            expect(() =>
                schemas.patchUpdateCampaignMatchMapImages.body.parse({
                    imageObject: JSON.stringify([
                        {
                            id: 'map-1',
                            link: 'https://img.bb/map',
                            uploadDate: '2026-06-06T00:00:00.000Z',
                            deleteUrl: '',
                            request: { success: true, status: 200 },
                        },
                    ]),
                })
            ).to.not.throw();
        });

        it('should validate create campaign imageObject payloads', () => {
            const schemas = CampaignsSchemas();

            expect(() =>
                schemas.postCreateCampaign.body.parse({
                    title: 'Campaign',
                    description: 'A short description',
                    system: 'dnd5e',
                    musics: '[]',
                    mainHistory: 'A great adventure begins',
                    playerAmountLimit: '4',
                    ageRestriction: '16',
                    configurations: JSON.stringify({ xpSystem: true, shopSystem: false }),
                    imageObject: JSON.stringify({
                        cover: {
                            id: 'cover-1',
                            link: 'https://img.bb/cover',
                            uploadDate: '2026-06-06T00:00:00.000Z',
                            deleteUrl: '',
                            request: { success: true, status: 200 },
                        },
                        mapImages: [
                            {
                                id: 'map-1',
                                link: 'https://img.bb/map',
                                uploadDate: '2026-06-06T00:00:00.000Z',
                                deleteUrl: '',
                                request: { success: true, status: 200 },
                            },
                        ],
                    }),
                })
            ).to.not.throw();
        });

        it('should validate create campaign imageObject payloads already parsed as objects', () => {
            const schemas = CampaignsSchemas();

            expect(() =>
                schemas.postCreateCampaign.body.parse({
                    title: 'Campaign',
                    description: 'A short description',
                    system: 'dnd5e',
                    musics: '[]',
                    mainHistory: 'A great adventure begins',
                    playerAmountLimit: '4',
                    ageRestriction: '16',
                    configurations: JSON.stringify({ xpSystem: true, shopSystem: false }),
                    imageObject: {
                        cover: {
                            id: 'cover-1',
                            link: 'https://img.bb/cover',
                            uploadDate: '2026-06-06T00:00:00.000Z',
                            deleteUrl: '',
                            request: { success: true, status: 200 },
                        },
                        mapImages: [
                            {
                                id: 'map-1',
                                link: 'https://img.bb/map',
                                uploadDate: '2026-06-06T00:00:00.000Z',
                                deleteUrl: '',
                                request: { success: true, status: 200 },
                            },
                        ],
                    },
                })
            ).to.not.throw();
        });

        it('should reject invalid create campaign imageObject JSON strings', () => {
            const schemas = CampaignsSchemas();

            expect(() =>
                schemas.postCreateCampaign.body.parse({
                    title: 'Campaign',
                    description: 'A short description',
                    system: 'dnd5e',
                    musics: '[]',
                    mainHistory: 'A great adventure begins',
                    playerAmountLimit: '4',
                    ageRestriction: '16',
                    configurations: JSON.stringify({ xpSystem: true, shopSystem: false }),
                    imageObject: '{invalid-json}',
                })
            ).to.throw();
        });

        it('should validate confirm presence defaults and campaign search limits', () => {
            const schemas = CampaignsSchemas();

            expect(
                schemas.postConfirmPlayerPresence.query.parse({
                    cancel: false,
                })
            ).to.deep.equal({ cancel: false });

            expect(() =>
                schemas.getAllCampaigns.query.parse({
                    code: '123456',
                })
            ).to.not.throw();

            expect(() =>
                schemas.getAllCampaigns.query.parse({
                    code: '1234567',
                })
            ).to.throw();
        });
    });
});
