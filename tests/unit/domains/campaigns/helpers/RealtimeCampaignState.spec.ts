import { buildCampaignSyncPayload, hydrateRealtimeCampaign } from 'src/domains/campaigns/helpers/RealtimeCampaignState';

describe('Domains :: Campaigns :: Helpers :: RealtimeCampaignState', () => {
    it('should create default realtime state and base tokens from campaign players', () => {
        const campaign = hydrateRealtimeCampaign({
            campaignId: 'campaign-1',
            title: 'Campaign',
            cover: {} as any,
            code: '123456',
            ageRestriction: '14',
            system: 'other',
            description: 'desc',
            campaignPlayers: [
                {
                    userId: 'user-1',
                    characterIds: ['character-1'],
                    role: 'dungeon_master',
                    status: 'active',
                },
            ],
            matchData: {
                matchId: 'match-1',
                prevDate: 'no-date',
                confirmedPlayers: [],
                characters: [],
                charactersInGame: [],
                musics: [],
                mapImages: [
                    {
                        id: 'map-1',
                        link: 'https://example.com/map-1',
                    },
                ],
                actualMapImage: {
                    id: 'map-1',
                    link: 'https://example.com/map-1',
                },
                logs: [],
            } as any,
            musics: [],
            infos: {
                campaignAge: '0',
                nextMatchDate: 'no-date',
                highlightedJournal: {},
                journal: [],
                playerAmountLimit: 4,
                visibility: 'visible',
                socialMedia: {},
            },
            password: 'no-password',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as any);

        expect(campaign.matchData.state.activeMapId).to.be.equal('map-1');
        expect(campaign.matchData.state.gridVisible).to.be.equal(true);
        expect(campaign.matchData.images).to.deep.equal([]);
        expect(campaign.matchData.imageHighlighted).to.equal(null);
        expect(campaign.matchData.state.tokens).to.have.length(1);
        expect(campaign.matchData.state.tokens[0].tokenId).to.be.equal('base:character-1');
    });

    it('should build the canonical sync payload', () => {
        const campaign = hydrateRealtimeCampaign({
            campaignId: 'campaign-1',
            title: 'Campaign',
            cover: {} as any,
            code: '123456',
            ageRestriction: '14',
            system: 'other',
            description: 'desc',
            campaignPlayers: [
                {
                    userId: 'user-1',
                    characterIds: ['character-1'],
                    role: 'dungeon_master',
                    status: 'active',
                },
            ],
            matchData: {
                matchId: 'match-1',
                prevDate: 'no-date',
                confirmedPlayers: [
                    {
                        userId: 'user-1',
                        characterIds: ['character-1'],
                        role: 'dungeon_master',
                        status: 'active',
                    },
                ],
                characters: [],
                charactersInGame: [],
                musics: [],
                mapImages: [],
                images: [
                    {
                        id: 'image-1',
                        link: 'https://example.com/image-1',
                    },
                ],
                imageHighlighted: {
                    id: 'image-1',
                    link: 'https://example.com/image-1',
                },
                logs: [],
                state: {
                    activeMapId: null,
                    gridVisible: true,
                    activeEffect: 'rain',
                    playingMusicId: 'music-1',
                    visibleCharacterIds: ['character-1'],
                    tokens: [],
                },
            } as any,
            musics: [],
            infos: {
                campaignAge: '0',
                nextMatchDate: 'no-date',
                highlightedJournal: {},
                journal: [],
                playerAmountLimit: 4,
                visibility: 'visible',
                socialMedia: {},
            },
            password: 'no-password',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as any);

        const payload = buildCampaignSyncPayload(campaign, [
            {
                userId: 'user-1',
                role: 'dungeon_master',
            },
        ]);

        expect(payload.campaignId).to.be.equal('campaign-1');
        expect(payload.presence.connectedUsers).to.have.length(1);
        expect(payload.match.activeEffect).to.be.equal('rain');
        expect(payload.match.playingMusicId).to.be.equal('music-1');
        expect(payload.match.images).to.have.length(1);
        expect(payload.match.imageHighlighted?.id).to.equal('image-1');
    });
});
