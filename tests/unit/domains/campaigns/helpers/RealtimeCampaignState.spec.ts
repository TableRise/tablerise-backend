import {
    buildCampaignSyncPayload,
    buildConfirmedPlayersPresence,
    hydrateRealtimeCampaign,
    normalizeHighlightedJournal,
    normalizeRealtimeMatchData,
    resolveActiveMap,
    syncLegacyMapSelection,
} from 'src/domains/campaigns/helpers/RealtimeCampaignState';

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

    it('should normalize legacy payloads, dedupe confirmed players, and sync legacy map selection', () => {
        const normalized = normalizeRealtimeMatchData({
            confirmedPlayers: [
                { userId: 'user-1', role: 'player', status: 'active', characterIds: [] },
                { userId: 'user-1', role: 'player', status: 'active', characterIds: [] },
            ],
            actualMapImage: {
                id: 'map-1',
                link: 'https://example.com/map-1',
            },
            imageHighlighted: 'invalid',
            state: {
                visibleCharacterIds: 'invalid',
                tokens: 'invalid',
            },
            characters: 'invalid',
            charactersInGame: 'invalid',
            musics: 'invalid',
            logs: 'invalid',
        } as any);

        expect(normalized.confirmedPlayers).to.have.length(1);
        expect(normalized.state.activeMapId).to.equal('map-1');
        expect(normalized.state.visibleCharacterIds).to.deep.equal([]);
        expect(normalized.state.tokens).to.deep.equal([]);
        expect(normalized.characters).to.deep.equal([]);
        expect(normalized.charactersInGame).to.deep.equal([]);
        expect(normalized.musics).to.deep.equal([]);
        expect(normalized.logs).to.deep.equal([]);
        expect(normalized.imageHighlighted).to.equal(null);

        const campaign = hydrateRealtimeCampaign({
            campaignId: 'campaign-2',
            title: 'Campaign',
            cover: {} as any,
            code: '654321',
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
                matchId: 'match-2',
                prevDate: 'no-date',
                confirmedPlayers: [],
                characters: [],
                charactersInGame: [],
                musics: [],
                mapImages: [{ id: 'map-1', link: 'https://example.com/map-1' }],
                logs: [],
                state: {
                    activeMapId: 'missing-map',
                    visibleCharacterIds: ['character-1', 'missing-character'],
                    tokens: [
                        {
                            tokenId: 'base:missing-character',
                            characterId: 'missing-character',
                            isClone: false,
                            xPct: 1,
                            yPct: 1,
                            widthPct: 1,
                            createdBy: 'user-1',
                            updatedBy: 'user-1',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                        {
                            tokenId: 'clone:missing-character',
                            characterId: 'missing-character',
                            isClone: true,
                            xPct: 1,
                            yPct: 1,
                            widthPct: 1,
                            createdBy: 'user-1',
                            updatedBy: 'user-1',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                    ],
                },
            } as any,
            musics: [],
            infos: {
                campaignAge: '0',
                nextMatchDate: 'no-date',
                highlightedJournal: {
                    title: 'Highlighted',
                    content: 'Important note',
                },
                journal: [],
                playerAmountLimit: 4,
                visibility: 'visible',
                socialMedia: {},
            },
            password: 'no-password',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as any);

        expect(campaign.matchData.state.tokens.some((token) => token.tokenId === 'base:character-1')).to.equal(true);
        expect(campaign.matchData.state.tokens.some((token) => token.tokenId === 'base:missing-character')).to.equal(
            false
        );
        expect(campaign.matchData.state.tokens.some((token) => token.tokenId === 'clone:missing-character')).to.equal(
            true
        );
        expect(campaign.matchData.state.visibleCharacterIds).to.deep.equal(['character-1']);

        const synced = syncLegacyMapSelection(campaign);
        expect(synced.matchData.actualMapImage).to.equal(undefined);

        const payload = buildCampaignSyncPayload(synced, []);
        expect(payload.match.activeMap).to.equal(null);
        expect(payload.match.highlightedJournalPost).to.deep.equal({
            title: 'Highlighted',
            content: 'Important note',
        });
    });

    it('should normalize undefined match data and preserve string nextSessionResume', () => {
        const emptyNormalized = normalizeRealtimeMatchData(undefined);
        expect(emptyNormalized.matchId).to.be.a('string');
        expect(emptyNormalized.prevDate).to.equal('no-date');
        expect(emptyNormalized.state.activeMapId).to.equal(null);

        const normalized = normalizeRealtimeMatchData({
            nextSessionResume: 'Session summary',
            state: {},
        } as any);

        expect(normalized.nextSessionResume).to.equal('Session summary');
    });

    it('should sync the active map object back into actualMapImage', () => {
        const campaign = hydrateRealtimeCampaign({
            campaignId: 'campaign-4',
            title: 'Campaign',
            cover: {} as any,
            code: '222222',
            ageRestriction: '14',
            system: 'other',
            description: 'desc',
            campaignPlayers: [],
            matchData: {
                matchId: 'match-4',
                prevDate: 'no-date',
                confirmedPlayers: [],
                characters: [],
                charactersInGame: [],
                musics: [],
                mapImages: [{ id: 'map-1', link: 'https://example.com/map-1' }],
                logs: [],
                state: {
                    activeMapId: 'map-1',
                    visibleCharacterIds: [],
                    tokens: [],
                },
            } as any,
            musics: [],
            infos: {
                campaignAge: '0',
                nextMatchDate: 'no-date',
                highlightedJournal: { invalid: true },
                journal: [],
                playerAmountLimit: 4,
                visibility: 'visible',
                socialMedia: {},
            },
            password: 'no-password',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as any);

        const synced = syncLegacyMapSelection(campaign);
        const payload = buildCampaignSyncPayload(synced, []);

        expect(synced.matchData.actualMapImage).to.deep.equal({
            id: 'map-1',
            link: 'https://example.com/map-1',
        });
        expect(payload.match.activeMap).to.equal('https://example.com/map-1');
        expect(payload.match.highlightedJournalPost).to.equal(null);
    });

    it('should expose helper functions for active map, highlighted journal, and confirmed player presence', () => {
        const campaign = hydrateRealtimeCampaign({
            campaignId: 'campaign-3',
            title: 'Campaign',
            cover: {} as any,
            code: '111111',
            ageRestriction: '14',
            system: 'other',
            description: 'desc',
            campaignPlayers: [
                {
                    userId: 'user-1',
                    characterIds: [],
                    role: 'player',
                    status: 'active',
                },
            ],
            matchData: {
                matchId: 'match-3',
                prevDate: 'no-date',
                confirmedPlayers: [
                    {
                        userId: 'user-1',
                        characterIds: [],
                        role: 'player',
                        status: 'active',
                    },
                ],
                characters: [],
                charactersInGame: [],
                musics: [],
                mapImages: [{ id: 'map-1', link: 'https://example.com/map-1' }],
                logs: [],
                state: {
                    activeMapId: 'map-1',
                    visibleCharacterIds: [],
                    tokens: [],
                },
            } as any,
            musics: [],
            infos: {
                campaignAge: '0',
                nextMatchDate: 'no-date',
                highlightedJournal: {
                    title: 'Journal',
                    content: 'Post',
                },
                journal: [],
                playerAmountLimit: 4,
                visibility: 'visible',
                socialMedia: {},
            },
            password: 'no-password',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as any);

        expect(resolveActiveMap(campaign)?.id).to.equal('map-1');
        expect(
            normalizeHighlightedJournal({
                title: 'Journal',
                content: 'Post',
            } as any)
        ).to.deep.equal({
            title: 'Journal',
            content: 'Post',
        });
        expect(normalizeHighlightedJournal({ foo: 'bar' } as any)).to.equal(null);
        expect(buildConfirmedPlayersPresence(campaign.matchData.confirmedPlayers)).to.deep.equal([
            {
                userId: 'user-1',
                role: 'player',
            },
        ]);
    });

    it('should dedupe empty user ids only once when uniquePlayers runs through the sync payload', () => {
        const campaign = hydrateRealtimeCampaign({
            campaignId: 'campaign-5',
            title: 'Campaign',
            cover: {} as any,
            code: '333333',
            ageRestriction: '14',
            system: 'other',
            description: 'desc',
            campaignPlayers: [],
            matchData: {
                matchId: 'match-5',
                prevDate: 'no-date',
                confirmedPlayers: [
                    { userId: '', characterIds: [], role: 'player', status: 'active' },
                    { userId: '', characterIds: [], role: 'player', status: 'active' },
                ],
                characters: [],
                charactersInGame: [],
                musics: [],
                mapImages: [],
                logs: [],
                state: {},
            } as any,
            musics: [],
            infos: {
                campaignAge: '0',
                nextMatchDate: 'no-date',
                highlightedJournal: null,
                journal: [],
                playerAmountLimit: 4,
                visibility: 'visible',
                socialMedia: {},
            },
            password: 'no-password',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as any);

        expect(campaign.matchData.confirmedPlayers).to.have.length(1);
    });
});
