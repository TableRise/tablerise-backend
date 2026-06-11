import CharactersSchemas from 'src/interface/characters/presentation/character/CharactersSchemas';

describe('Interface :: Characters :: Presentation :: Characters :: CharactersSchemas', () => {
    context('When the schemas factory is called', () => {
        it('should return object with all expected schema keys', () => {
            const schemas = CharactersSchemas();

            expect(schemas).to.have.property('postCreateCharacter');
            expect(schemas).to.have.property('putUpdateCharacter');
            expect(schemas).to.have.property('postCharacterPicture');
        });

        it('should validate character picture uploads for browser and multer file objects', () => {
            const schemas = CharactersSchemas();

            expect(() =>
                schemas.postCharacterPicture.body.parse({
                    picture: new File(['character'], 'character.png', { type: 'image/png' }),
                })
            ).to.not.throw();

            expect(() =>
                schemas.postCharacterPicture.body.parse({
                    picture: {
                        fieldname: 'picture',
                        originalname: 'character.png',
                        mimetype: 'image/png',
                        buffer: Buffer.from('character'),
                    },
                })
            ).to.not.throw();

            expect(() =>
                schemas.postCharacterPicture.body.parse({
                    imageObject: JSON.stringify({
                        id: 'image-1',
                        link: 'https://img.bb/character',
                        uploadDate: '2026-06-06T00:00:00.000Z',
                        deleteUrl: '',
                        request: { success: true, status: 200 },
                    }),
                })
            ).to.not.throw();
        });

        it('should allow create character payloads with partial or missing extraAbilities', () => {
            const schemas = CharactersSchemas();
            const basePayload = {
                npc: false,
                data: {
                    profile: {
                        name: 'Hero',
                        class: 'Wizard',
                        race: 'Elf',
                        level: 1,
                        xp: 0,
                        characteristics: {
                            alignment: 'neutral',
                            backstory: 'A traveler',
                            background: 'sage',
                            personalityTraits: 'calm',
                            ideals: 'truth',
                            bonds: 'party',
                            flaws: 'reckless',
                            appearance: {
                                description: 'Tall',
                                eyes: 'green',
                                age: '120',
                                weight: '70kg',
                                height: '180cm',
                                skin: 'fair',
                                hair: 'black',
                            },
                            alliesAndOrgs: '',
                            other: {
                                characteristicsAndAbilities: '',
                            },
                            treasure: '',
                        },
                    },
                    stats: {
                        abilityScores: [],
                        proficiencyBonus: 2,
                        inspiration: 0,
                        passiveWisdom: 10,
                        speed: 30,
                        initiative: 2,
                        armorClass: 12,
                        hitPoints: {
                            points: 8,
                            currentPoints: 8,
                            tempPoints: 0,
                            dicePoints: '1d8',
                        },
                        deathSaves: {
                            success: 0,
                            failures: 0,
                        },
                        spellCasting: {
                            class: 'Wizard',
                            ability: 'intelligence',
                            saveDc: 12,
                            attackBonus: 4,
                        },
                    },
                    inventory: '',
                    money: {
                        cp: 0,
                        sp: 0,
                        ep: 0,
                        gp: 0,
                        pp: 0,
                    },
                    spells: {
                        cantrips: [],
                        1: { spellIds: [], slotsTotal: 2, slotsExpended: 0 },
                        2: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                        3: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                        4: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                        5: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                        6: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                        7: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                        8: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                        9: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    },
                },
            };

            expect(() => schemas.postCreateCharacter.body.parse(basePayload)).to.not.throw();

            expect(() =>
                schemas.postCreateCharacter.body.parse({
                    ...basePayload,
                    data: {
                        ...basePayload.data,
                        extraAbilities: {
                            cantrips: ['bardic inspiration'],
                            1: { slotsTotal: 2 },
                            2: {},
                            3: { slotsExpended: 1 },
                        },
                    },
                })
            ).to.not.throw();
        });
    });
});
