import newUUID from 'src/domains/common/helpers/newUUID';
import {
    Armor,
    Background,
    Class,
    Feat,
    God,
    MagicItem,
    Monster,
} from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';

function createArmorsFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Armor> & { armorId: string } {
    return {
        armorId: entityId || newUUID(),
        active: true,
        en: {
            type: 'Plate',
            name: 'Steel Plate',
            description: 'A sturdy steel plate armor for maximum protection.',
            cost: {
                value: 200,
                currency: 'gold',
            },
            weight: 30,
            armorClass: 18,
            requiredStrength: 15,
            stealthPenalty: true,
        },
        pt: {
            type: 'Placa',
            name: 'Placa de Aço',
            description: 'Uma armadura de placa de aço resistente para máxima proteção.',
            cost: {
                value: 200,
                currency: 'ouro',
            },
            weight: 30,
            armorClass: 18,
            requiredStrength: 15,
            stealthPenalty: true,
        },
    };
}

function createFeatsFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Feat> & { featId: string } {
    return {
        featId: entityId || newUUID(),
        active: true,
        en: {
            name: 'Grappler',
            prerequisite: 'Strength 13 or higher',
            description:
                "You've developed the skills necessary to hold your own in close-quarters grappling.",
            benefits: [
                'You have advantage on attack rolls against a creature you are grappling.',
                'You can use your action to try to pin a creature grappled by you. To do so, make another grapple check. If you succeed, you and the creature are both restrained until the grapple ends.',
            ],
        },
        pt: {
            name: 'Grappler',
            prerequisite: 'Força 13 ou superior',
            description:
                'Você desenvolveu as habilidades necessárias para se manter em confrontos de agarrar em espaços confinados.',
            benefits: [
                'Você tem vantagem em rolagens de ataque contra uma criatura que você está agarrando.',
                'Você pode usar sua ação para tentar imobilizar uma criatura que esteja agarrada por você. Para fazer isso, faça outra rolagem de agarrar. Se tiver sucesso, você e a criatura ficam restritos até o fim do agarrão.',
            ],
        },
    };
}

function createBackgroundsFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Background> & { backgroundId: string } {
    return {
        backgroundId: entityId || newUUID(),
        active: true,
        en: {
            name: 'Acolyte',
            description:
                "You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, performing sacred rites and offering sacrifices in order to conduct worshippers into the presence of the divine. You are not necessarily a cleric—performing sacred rites is not the same thing as channeling divine power.\nChoose a god, a pantheon of gods, or some other quasi-divine being from among those listed in 'Fantasy-Historical Pantheons' or those specified by your GM, and work with your GM to detail the nature of your religious service. Were you a lesser functionary in a temple, raised from childhood to assist the priests in the sacred rites? Or were you a high priest who suddenly experienced a call to serve your god in a different way? Perhaps you were the leader of a small cult outside of any established temple structure, or even an occult group that served a fiendish master that you now deny.",
            skillProficiencies: ['Insight', 'Religion'],
            languages: ['common'],
            equipment: [
                'Holy symbol (a gift to you when you entered the priesthood)',
                'A prayer book or prayer wheel',
                '5 sticks of incense',
                'vestments',
                'A set of common clothes',
                'a pouch containing 15 gp',
            ],
            characteristics: {
                name: 'Shelter of the Faithful',
                description:
                    'As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle.\nYou might also have ties to a specific temple dedicated to your chosen deity or pantheon, and you have a residence there. This could be the temple where you used to serve, if you remain on good terms with it, or a temple where you have found a new home. While near your temple, you can call upon the priests for assistance, provided the assistance you ask for is not hazardous and you remain in good standing with your temple.',
                suggested: {
                    personalityTrait: [
                        "I idolize a particular hero of my faith and constantly refer to that person's deeds and example.",
                        'I can find common ground between the fiercest enemies, empathizing with them and always working toward peace.',
                        'I see omens in every event and action. The gods try to speak to us, we just need to listen.',
                        'Nothing can shake my optimistic attitude.',
                        'I quote (or misquote) sacred texts and proverbs in almost every situation.',
                        'I am tolerant (or intolerant) of other faiths and respect (or condemn) the worship of other gods.',
                        "I've enjoyed fine food, drink, and high society among my temple’s elite. Rough living grates on me.",
                        "I've spent so long in the temple that I have little practical experience dealing with people in the outside world.",
                    ],
                    ideal: [
                        'Tradition. The ancient traditions of worship and sacrifice must be preserved and upheld. (Lawful)',
                        'Charity. I always try to help those in need, no matter what the personal cost. (Good)',
                        'Change. We must help bring about the changes the gods are constantly working in the world. (Chaotic)',
                        "Power. I hope to one day rise to the top of my faith's religious hierarchy. (Lawful)",
                        'Faith. I trust that my deity will guide my actions. I have faith that if I work hard, things will go well. (Lawful)',
                        "Aspiration. I seek to prove myself worthy of my god's favor by matching my actions to my deity's teachings. (Any)",
                    ],
                    bond: [
                        'I would die to recover an ancient relic of my faith that was lost long ago.',
                        'I will someday get revenge on the corrupt temple hierarchy who branded me a heretic.',
                        'I owe my life to the priest who took me in when my parents died.',
                        'Everything I do is for the common people.',
                        'I will do anything to protect the temple where I served.',
                        'I seek to preserve a sacred text that my enemies seek to destroy.',
                    ],
                    flaw: [
                        'Judge others harshly, and myself even more severely.',
                        "I put too much trust in those who wield power within my temple's hierarchy.",
                        'My piety sometimes leads me to blindly trust those that profess faith in my god.',
                        'I am inflexible in my thinking.',
                        'I am suspicious of strangers and expect the worst of them.',
                        'Once I pick a goal, I become obsessed with it to the detriment of everything else in my life.',
                    ],
                },
            },
        },
        pt: {
            name: 'Acólito',
            description:
                "Você passou sua vida no serviço de um templo dedicado a um deus específico ou panteão de deuses. Você age como intermediário entre o reino sagrado e o mundo mortal, realizando rituais sagrados e oferecendo sacrifícios para conduzir adoradores à presença do divino. Você não é necessariamente um clérigo - realizar rituais sagrados não é a mesma coisa que canalizar poder divino.\nEscolha um deus, um panteão de deuses ou algum outro ser quase-divino entre aqueles listados em 'Fantasy-Historical Pantheons' ou especificados pelo seu GM, e trabalhe com seu GM para detalhar a natureza do seu serviço religioso. Você era um funcionário de menor importância em um templo, criado desde a infância para auxiliar os sacerdotes nos rituais sagrados? Ou era um sumo sacerdote que de repente recebeu um chamado para servir seu deus de uma maneira diferente? Talvez você fosse o líder de um pequeno culto fora de qualquer estrutura de templo estabelecida, ou até mesmo um grupo ocultista que servia a um mestre demoníaco que agora você nega.",
            skillProficiencies: ['Percepção', 'Religião'],
            languages: ['comum'],
            equipment: [
                'Símbolo sagrado (um presente para você quando ingressou no sacerdócio)',
                'Um livro de orações ou roda de orações',
                '5 bastões de incenso',
                'Vestes',
                'Um conjunto de roupas comuns',
                'Uma bolsa contendo 15 po.',
            ],
            characteristics: {
                name: 'Amparo dos Fiéis',
                description:
                    'Como acólito, você recebe o respeito daqueles que compartilham sua fé e pode realizar as cerimônias religiosas de sua divindade. Você e seus companheiros de aventura podem esperar receber cura e cuidados gratuitos em um templo, santuário ou outra presença estabelecida de sua fé, embora você deva fornecer quaisquer componentes materiais necessários para as magias. Aqueles que compartilham sua religião o apoiarão (apenas você) em um estilo de vida modesto.\nVocê também pode ter laços com um templo específico dedicado à sua divindade ou panteão escolhido, e ter uma residência lá. Isso pode ser o templo onde você costumava servir, se você mantiver bons termos com ele, ou um templo onde você encontrou um novo lar. Quando estiver perto do seu templo, você pode pedir ajuda aos sacerdotes, desde que a ajuda solicitada não seja perigosa e você mantenha uma boa relação com seu templo.',
                suggested: {
                    personalityTrait: [
                        'Idolatro um herói específico da minha fé e constantemente faço referência aos feitos e exemplo dessa pessoa.',
                        'Consigo encontrar pontos em comum entre os inimigos mais ferozes, empatizando com eles e sempre trabalhando pela paz.',
                        'Vejo presságios em cada evento e ação. Os deuses tentam falar conosco, só precisamos ouvir.',
                        'Nada abala minha atitude otimista.',
                        'Cito (ou deturpo) textos sagrados e provérbios em quase todas as situações.',
                        'Sou tolerante (ou intolerante) em relação a outras fé e respeito (ou condeno) a adoração de outros deuses.',
                        'Desfrutei de boa comida, bebida e alta sociedade entre a elite do meu templo. Viver de forma simples me incomoda.',
                        'Passei tanto tempo no templo que tenho pouca experiência prática em lidar com pessoas no mundo exterior.',
                    ],
                    ideal: [
                        'Tradição. As antigas tradições de adoração e sacrifício devem ser preservadas e mantidas. (Leal)',
                        'Caridade. Sempre tento ajudar aqueles em necessidade, não importando o custo pessoal. (Bom)',
                        'Mudança. Devemos ajudar a promover as mudanças que os deuses estão constantemente realizando no mundo. (Caótico)',
                        'Poder. Espero um dia chegar ao topo da hierarquia religiosa da minha fé. (Leal)',
                        'Fé. Confio que minha divindade guiará minhas ações. Tenho fé de que, se trabalhar duro, as coisas correrão bem. (Leal)',
                        'Aspiração. Busco me provar digno do favor do meu deus, vivendo de acordo com os ensinamentos dele. (Qualquer)',
                    ],
                    bond: [
                        'Daria minha vida para recuperar um relicário antigo da minha fé que foi perdido há muito tempo.',
                        'Um dia me vingarei da hierarquia corrupta do templo que me rotulou como herege.',
                        'Devo minha vida ao sacerdote que me acolheu quando meus pais morreram.',
                        'Tudo o que faço é para o povo comum.',
                        'Farei qualquer coisa para proteger o templo onde servi.',
                        'Busco preservar um texto sagrado que meus inimigos buscam destruir.',
                    ],
                    flaw: [
                        'Julgar os outros severamente e a mim mesmo ainda mais.',
                        'Colocar confiança demais naqueles que detêm poder dentro da hierarquia do meu templo.',
                        'Minha piedade às vezes me leva a confiar cegamente naqueles que professam fé no meu deus.',
                        'Ser inflexível em meu pensamento.',
                        'Ser desconfiado de estranhos e esperar o pior deles.',
                        'Uma vez que defino um objetivo, me torno obcecado por ele em detrimento de tudo o mais em minha vida.',
                    ],
                },
            },
        },
    };
}

function createClassesFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Class> & { classId: string } {
    return {
        classId: entityId || newUUID(),
        active: true,
        en: {
            name: 'Barbarian',
            description:
                'You dedicate your life to the art of war, and your greatest pleasure is knowing that with each battle, your power and strength grow stronger. As an ally, you are an indispensable resource in any army and a source of fear for any enemy. As a friend, you protect your own even if it means sacrificing your own life, for it would be a dishonor for you, barbarian, to fail in protecting those you love.\n\nYour fury is relentless, and your resilience is formidable. Stories are told far and wide of how mighty barbarians have been able to defeat armies single-handedly, and with you, it will be no different.',
            hitPoints: {
                hitDice: '1d12 per barbarian level',
                hitPointsAtFirstLevel: '12 + Constitution modifier',
                hitPointsAtHigherLevels:
                    '1d12 (or 7) + Constitution modifier per barbarian level after first level',
            },
            proficiencies: {
                armor: ['light armor', 'medium armor', 'shields'],
                weapons: ['simple weapons', 'martial weapons'],
                tools: [],
                savingThrows: ['strength', 'constitution'],
                skills: [
                    'animal handling',
                    'athletics',
                    'intimidation',
                    'nature',
                    'perception',
                    'survival',
                ],
            },
            equipment: [
                {
                    a: 'greataxe',
                    b: 'martial melee weapon',
                },
                {
                    a: 'two handaxes',
                    b: 'simple weapon',
                },
                {
                    a: "explorer's pack and four javelins",
                    b: 'no-alternative',
                },
            ],
            levelingSpecs: {
                level: [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                ],
                proficiencyBonus: [
                    2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6,
                ],
                features: [
                    'Range, Unarmored Defense',
                    'Reckless Attack, Danger Sense',
                    'Primal Path',
                    'Ability Score Improvement',
                    'Extra Attack',
                    'Fast Movement',
                    'Path Feature',
                    'Feral Instinct',
                    'Ability Score Improvement',
                    'Brutal Critical (1 dice)',
                    'Path Feature',
                    'Relentless Rage',
                    'Ability Score Improvement',
                    'Brutal Critical (2 dice)',
                    'Path Feature',
                    'Persistent Rage',
                    'Ability Score Improvement',
                    'Brutal Critical (3 dice)',
                    'Indomitable Might',
                    'Ability Score Improvement',
                    'Primal Champion',
                ],
                cantripsKnown: {
                    isValidToThisClass: false,
                    amount: [],
                },
                spellSlotsPerSpellLevel: {
                    isValidToThisClass: false,
                    spellLevel: [],
                    spellSpaces: [],
                },
                spellsKnown: {
                    isValidToThisClass: false,
                    amount: [],
                },
                kiPoints: {
                    isValidToThisClass: false,
                    amount: [],
                },
                martialArts: {
                    isValidToThisClass: false,
                    amount: [],
                },
                unarmoredMovement: {
                    isValidToThisClass: false,
                    amount: [],
                },
                sneakAttack: {
                    isValidToThisClass: false,
                    amount: [],
                },
                sorceryPoints: {
                    isValidToThisClass: false,
                    amount: [],
                },
                invocationsKnown: {
                    isValidToThisClass: false,
                    amount: [],
                },
                rages: {
                    isValidToThisClass: true,
                    amount: [
                        2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 999,
                    ],
                },
                rageDamage: {
                    isValidToThisClass: true,
                    amount: [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4],
                },
            },
            characteristics: [
                {
                    title: 'Rage',
                    description:
                        "In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action.\n\nWhile raging, you gain the following benefits if you aren't wearing heavy armor:\n\nYou have advantage on Strength checks and Strength saving throws.\n\nWhen you make a melee weapon attack using Strength, you gain a bonus to the damage roll that increases as you gain levels as a barbarian, as shown in the Rage Damage column of the Barbarian table.\n\nYou have resistance to bludgeoning, piercing, and slashing damage.\n\nIf you are able to cast spells, you can't cast them or concentrate on them while raging.\n\nYour rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven't attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action.\n\nOnce you have raged the number of times shown for your barbarian level in the Rages column of the Barbarian table, you must finish a long rest before you can rage again.",
                },
                {
                    title: 'Unarmored Defense',
                    description:
                        'While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.',
                },
                {
                    title: 'Reckless Attack',
                    description:
                        'Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.',
                },
                {
                    title: 'Danger Sense',
                    description:
                        "At 2nd level, you gain an uncanny sense of when things nearby aren't as they should be, giving you an edge when you dodge away from danger.\n\nYou have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can't be blinded, deafened, or incapacitated.",
                },
                {
                    title: 'Primal Path',
                    description:
                        'At 3rd level, you choose a path that shapes the nature of your rage. Choose the Path of the Berserker or the Path of the Totem Warrior, both detailed at the end of the class description. Your choice grants you features at 3rd level and again at 6th, 10th, and 14th levels.',
                },
                {
                    title: 'Ability Score Improvement',
                    description:
                        "When you reach 4th level, and again at 8th, 12th, 16th and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
                },
                {
                    title: 'Extra Attack',
                    description:
                        'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
                },
                {
                    title: 'Fast Movement',
                    description:
                        "Starting at 5th level, your speed increases by 10 feet while you aren't wearing heavy armor.",
                },
                {
                    title: 'Feral Instinct',
                    description:
                        "By 7th level, your instincts are so honed that you have advantage on initiative rolls.\n\nAdditionally, if you are surprised at the beginning of combat and aren't incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn.",
                },
                {
                    title: 'Brutal Critical',
                    description:
                        'Beginning at 9th level, you can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack.\n\nThis increases to two additional dice at 13th level and three additional dice at 17th level.',
                },
                {
                    title: 'Relentless Rage',
                    description:
                        "Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you're raging and don't die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead.\n\nEach time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10.",
                },
                {
                    title: 'Persistent Rage',
                    description:
                        'Beginning at 15th level, your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it.',
                },
                {
                    title: 'Indomitable Might',
                    description:
                        'Beginning at 18th level, if your total for a Strength check is less than your Strength score, you can use that score in place of the total.',
                },
                {
                    title: 'Primal Champion',
                    description:
                        'At 20th level, you embody the power of the wilds. Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24.',
                },
                {
                    title: 'Path of the Berserker',
                    description:
                        "For some barbarians, rage is a means to an end–that end being violence. The Path of the Berserker is a path of untrammeled fury, slick with blood. As you enter the berserker's rage, you thrill in the chaos of battle, heedless of your own health or well-being.",
                },
                {
                    title: 'Frenzy',
                    description:
                        "Beginning at 6th level, you can't be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.",
                },
                {
                    title: 'Mindless Rage',
                    description:
                        "Beginning at 6th level, you can't be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.",
                },
                {
                    title: 'Intimidating Presence',
                    description:
                        "Beginning at 10th level, you can use your action to frighten someone with your menacing presence. When you do so, choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a Wisdom saving throw (DC equal to 8 + your proficiency bonus + your Charisma modifier) or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. This effect ends if the creature ends its turn out of line of sight or more than 60 feet away from you.\n\nIf the creature succeeds on its saving throw, you can't use this feature on that creature again for 24 hours.",
                },
                {
                    title: 'Retaliation',
                    description:
                        'Starting at 14th level, when you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.',
                },
            ],
        },
        pt: {
            name: 'Bárbaro',
            description:
                'Você dedica sua vida a arte da guerra e o seu maior prazer é saber que a cada batalha seu poder e força crescem cada vez mais, como um aliado você é um recurso indíspensavel em qualquer exercito e uma fonte de medo para qualquer inimigo, como amigo você protege os seus mesmo que precise entregar sua própria vida, afinal seria uma desonra para você bárbaro não conseguir proteger aqueles que ama.\n\nSua fúria é implacável e sua resistência formidável, histórias são contadas pelos quatro cantos do mundo de como barbáros poderosos foram capazes de vencer exercitos sozinhos, e com você não será diferente.',
            hitPoints: {
                hitDice: '1d12 por nível de bárbaro',
                hitPointsAtFirstLevel: '12 + modificador de Constituição',
                hitPointsAtHigherLevels:
                    '1d12 (ou 7) + modificador de Constituição por nível de bárbaro após o primeiro nível',
            },
            proficiencies: {
                armor: ['armadura leve', 'armadura média', 'escudos'],
                weapons: ['armas simples', 'armas marciais'],
                tools: [],
                savingThrows: ['força', 'constituição'],
                skills: [
                    'adestrar animais',
                    'atletismo',
                    'intimidação',
                    'natureza',
                    'percepção',
                    'sobrevivência',
                ],
            },
            equipment: [
                {
                    a: 'grande machado',
                    b: 'arma marcial corpo a corpo',
                },
                {
                    a: 'dois machados de mão',
                    b: 'arma simples',
                },
                {
                    a: 'mochila do aventureiro e quatro dardos',
                    b: 'no-alternative',
                },
            ],
            levelingSpecs: {
                level: [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                ],
                proficiencyBonus: [
                    2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6,
                ],
                features: [
                    'Raiva, Defesa Inarmada',
                    'Ataque Despreocupado, Sentido de Perigo',
                    'Caminho Primitivo',
                    'Melhoria de Atributo',
                    'Ataque Extra',
                    'Movimento Rápido',
                    'Característica do Caminho',
                    'Instinto Selvagem',
                    'Melhoria de Atributo',
                    'Crítico Brutal (1 dado)',
                    'Característica do Caminho',
                    'Raiva Implacável',
                    'Melhoria de Atributo',
                    'Crítico Brutal (2 dados)',
                    'Característica do Caminho',
                    'Raiva Persistente',
                    'Melhoria de Atributo',
                    'Crítico Brutal (3 dados)',
                    'Força Indomável',
                    'Melhoria de Atributo',
                    'Campeão Primitivo',
                ],
                cantripsKnown: {
                    isValidToThisClass: false,
                    amount: [],
                },
                spellSlotsPerSpellLevel: {
                    isValidToThisClass: false,
                    spellLevel: [],
                    spellSpaces: [],
                },
                spellsKnown: {
                    isValidToThisClass: false,
                    amount: [],
                },
                kiPoints: {
                    isValidToThisClass: false,
                    amount: [],
                },
                martialArts: {
                    isValidToThisClass: false,
                    amount: [],
                },
                unarmoredMovement: {
                    isValidToThisClass: false,
                    amount: [],
                },
                sneakAttack: {
                    isValidToThisClass: false,
                    amount: [],
                },
                sorceryPoints: {
                    isValidToThisClass: false,
                    amount: [],
                },
                invocationsKnown: {
                    isValidToThisClass: false,
                    amount: [],
                },
                rages: {
                    isValidToThisClass: true,
                    amount: [
                        2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 999,
                    ],
                },
                rageDamage: {
                    isValidToThisClass: true,
                    amount: [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4],
                },
            },
            characteristics: [
                {
                    title: 'Raiva',
                    description:
                        'Na batalha, você luta com ferocidade primal. Em seu turno, você pode entrar em uma raiva como uma ação bônus.\n\nEnquanto está em raiva, você ganha os seguintes benefícios se não estiver usando armadura pesada:\n\nVocê tem vantagem em testes de Força e em testes de resistência de Força.\n\nQuando você faz um ataque com arma corpo a corpo usando Força, você ganha um bônus no dano que aumenta conforme você ganha níveis de bárbaro, como mostrado na coluna Dano da Raiva na tabela do Bárbaro.\n\nVocê tem resistência a dano contundente, perfurante e cortante.\n\nSe você for capaz de conjurar magias, não pode conjurá-las nem concentrar-se nelas enquanto estiver em raiva.\n\nSua raiva dura 1 minuto. Ela termina antecipadamente se você for derrubado inconsciente ou se seu turno terminar e você não tiver atacado uma criatura hostil desde seu último turno ou sofrido dano desde então. Você também pode encerrar sua raiva em seu turno como uma ação bônus.\n\nDepois de ter usado a raiva o número de vezes mostrado para seu nível de bárbaro na coluna Raivas da tabela do Bárbaro, você precisa terminar um descanso longo antes de poder usar a raiva novamente.',
                },
                {
                    title: 'Defesa Inarmada',
                    description:
                        'Enquanto você não estiver usando qualquer armadura, sua Classe de Armadura é igual a 10 + seu modificador de Destreza + seu modificador de Constituição. Você pode usar um escudo e ainda obter esse benefício.',
                },
                {
                    title: 'Ataque Despreocupado',
                    description:
                        'A partir do 2º nível, você pode deixar de lado toda preocupação com defesa para atacar com uma fúria feroz. Quando você fizer seu primeiro ataque em seu turno, você pode decidir atacar despreocupadamente. Ao fazer isso, você tem vantagem em rolagens de ataque com arma corpo a corpo usando Força durante este turno, mas rolagens de ataque contra você têm vantagem até o seu próximo turno.',
                },
                {
                    title: 'Sentido de Perigo',
                    description:
                        'No 2º nível, você desenvolve um sentido inigualável para quando as coisas ao seu redor não estão como deveriam, o que lhe dá uma vantagem ao se esquivar do perigo.\n\nVocê tem vantagem em testes de resistência de Destreza contra efeitos que você pode ver, como armadilhas e magias. Para obter esse benefício, você não pode estar cego, surdo ou incapacitado.',
                },
                {
                    title: 'Caminho Primitivo',
                    description:
                        'No 3º nível, você escolhe um caminho que molda a natureza de sua raiva. Escolha o Caminho do Berserker ou o Caminho do Guerreiro Totêmico, ambos detalhados no final da descrição da classe. Sua escolha concede características a você no 3º nível e novamente nos níveis 6, 10 e 14.',
                },
                {
                    title: 'Melhoria de Atributo',
                    description:
                        'Quando você atinge o 4º nível e novamente no 8º, 12º, 16º e 19º nível, você pode aumentar um atributo de sua escolha em 2, ou pode aumentar dois atributos de sua escolha em 1. Como de costume, você não pode aumentar um atributo acima de 20 usando esse recurso.',
                },
                {
                    title: 'Ataque Extra',
                    description:
                        'A partir do 5º nível, você pode atacar duas vezes, em vez de uma, sempre que executar a ação Atacar em seu turno.',
                },
                {
                    title: 'Movimento Rápido',
                    description:
                        'A partir do 5º nível, sua velocidade aumenta em 3 metros enquanto você não estiver usando armadura pesada.',
                },
                {
                    title: 'Instinto Selvagem',
                    description:
                        'Aos 7º nível, seus instintos estão tão apurados que você tem vantagem em rolagens de iniciativa.\n\nAlém disso, se você estiver surpreso no início do combate e não estiver incapacitado, você pode agir normalmente em seu primeiro turno, mas somente se você entrar em sua raiva antes de fazer qualquer outra coisa naquele turno.',
                },
                {
                    title: 'Crítico Brutal',
                    description:
                        'A partir do 9º nível, você pode rolar um dado de dano adicional ao determinar o dano extra para um acerto crítico com um ataque corpo a corpo.\n\nIsso aumenta para dois dados adicionais no 13º nível e três dados adicionais no 17º nível.',
                },
                {
                    title: 'Raiva Implacável',
                    description:
                        'A partir do 11º nível, sua raiva pode mantê-lo lutando mesmo com ferimentos graves. Se você chegar a 0 pontos de vida enquanto estiver em raiva e não morrer imediatamente, poderá fazer um teste de resistência de Constituição CD 10. Se tiver sucesso, em vez disso, você cairá a 1 ponto de vida.\n\nCada vez que você usa essa característica depois da primeira, a CD aumenta em 5. Quando você termina um descanso curto ou longo, a CD é redefinida para 10.',
                },
                {
                    title: 'Raiva Persistente',
                    description:
                        'A partir do 15º nível, sua raiva é tão intensa que ela termina antecipadamente apenas se você ficar inconsciente ou se escolher terminá-la.',
                },
                {
                    title: 'Força Indomável',
                    description:
                        'A partir do 18º nível, se o total de um teste de Força for inferior ao seu valor de Força, você pode usar esse valor no lugar do total.',
                },
                {
                    title: 'Campeão Primitivo',
                    description:
                        'No 20º nível, você personifica o poder das terras selvagens. Seus valores de Força e Constituição aumentam em 4. Seus valores máximos para esses atributos agora são 24.',
                },
                {
                    title: 'Caminho do Berserker',
                    description:
                        'Para alguns bárbaros, a raiva é um meio para um fim - esse fim sendo a violência. O Caminho do Berserker é um caminho de fúria indomada, encharcado de sangue. Ao entrar na raiva do berserker, você se delicia no caos da batalha, sem se importar com sua própria saúde ou bem-estar.',
                },
                {
                    title: 'Frenesi',
                    description:
                        'A partir do 6º nível, você não pode ser encantado ou amedrontado enquanto estiver em raiva. Se você estiver encantado ou amedrontado quando entrar em sua raiva, o efeito é suspenso durante a duração da raiva.',
                },
                {
                    title: 'Fúria Sem Mente',
                    description:
                        'A partir do 6º nível, você não pode ser encantado ou amedrontado enquanto estiver em fúria. Se você estiver encantado ou amedrontado quando entrar em fúria, o efeito é suspenso durante a duração da fúria.',
                },
                {
                    title: 'Presença Intimidadora',
                    description:
                        'A partir do 10º nível, você pode usar sua ação para amedrontar alguém com sua presença ameaçadora. Ao fazer isso, escolha uma criatura que você possa ver a até 9.1 metros de você. Se a criatura puder ver ou ouvir você, ela deve ter sucesso em um teste de resistência de Sabedoria (CD igual a 8 + seu bônus de proficiência + seu modificador de Carisma) ou ficar amedrontada por você até o final de seu próximo turno. Em turnos subsequentes, você pode usar sua ação para estender a duração desse efeito na criatura amedrontada até o final de seu próximo turno. Esse efeito termina se a criatura terminar seu turno fora do alcance da sua visão ou a mais de 18.2 metros de você.\n\nSe a criatura tiver sucesso em seu teste de resistência, você não pode usar essa característica novamente nessa criatura durante 24 horas.',
                },
                {
                    title: 'Retaliação',
                    description:
                        'A partir do 14º nível, quando você sofrer dano de uma criatura que esteja a até 1.5 metros de você, você pode usar sua reação para fazer um ataque corpo a corpo contra essa criatura.',
                },
            ],
        },
    };
}

function createGodsFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<God> & { godId: string } {
    return {
        godId: entityId || newUUID(),
        active: true,
        en: {
            name: 'The Daghdha, god of weather and crops',
            alignment: 'CG',
            suggestedDomains: 'Nature, Trickery',
            symbol: 'Bubbling cauldron or shield',
            pantheon: 'Celtic',
        },
        pt: {
            name: 'O Daghdha, deus do clima e das colheitas',
            alignment: 'CG',
            suggestedDomains: 'Natureza, Trapaça',
            symbol: 'Caldeirão borbulhante ou escudo',
            pantheon: 'Céltico',
        },
    };
}
function createMagicItemsFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<MagicItem> & { magicItemId: string } {
    return {
        magicItemId: entityId || newUUID(),
        active: true,
        en: {
            name: 'Adamantine Armor',
            characteristics: ['Armor (medium or heavy, but not hide)', 'uncommon'],
            description:
                "This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any critical hit against you becomes a normal hit.",
        },
        pt: {
            name: 'Armadura de Adamantina',
            characteristics: ['Armadura (média ou pesada, mas não de couro)', 'incomum'],
            description:
                'Esta armadura é reforçada com adamantina, uma das substâncias mais duras que existem. Enquanto estiver usando-a, qualquer acerto crítico contra você se torna um acerto normal.',
        },
    };
}

function createMonstersFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Monster> & { monsterId: string } {
    return {
        monsterId: entityId || newUUID(),
        active: true,
        en: {
            name: 'Aboleth',
            characteristics: ['large aberration', 'lawful evil'],
            stats: {
                armorClass: 17,
                hitPoints: {
                    hitDice: '18d10 + 36',
                    default: 135,
                },
                speed: '10 feet, swim 40 feet',
                savingThrows: [
                    {
                        name: 'constitution',
                        value: 6,
                    },
                    {
                        name: 'intelligence',
                        value: 8,
                    },
                    {
                        name: 'wisdom',
                        value: 6,
                    },
                ],
                damageImmunities: [],
                conditionImmunities: [],
                damageResistances: [],
                senses: ['darkvision 120 feet, passive Perception 20'],
                languages: ['deep speech', 'telepathy 120 feet'],
                challengeLevel: 10,
            },
            abilityScore: [
                {
                    name: 'strength',
                    value: 21,
                    modifier: 5,
                },
                {
                    name: 'dexterity',
                    value: 9,
                    modifier: -1,
                },
                {
                    name: 'constitution',
                    value: 15,
                    modifier: 2,
                },
                {
                    name: 'intelligence',
                    value: 18,
                    modifier: 4,
                },
                {
                    name: 'wisdom',
                    value: 15,
                    modifier: 2,
                },
                {
                    name: 'charism',
                    value: 18,
                    modifier: 4,
                },
            ],
            skills: [
                {
                    name: 'Amphibious',
                    description: 'The aboleth can breathe air and water.',
                },
                {
                    name: 'Mucous Cloud',
                    description:
                        'While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 feet of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater.',
                },
                {
                    name: 'Probing Telepathy',
                    description:
                        "If a creature communicates telepathically with the aboleth, the aboleth learns the creature's greatest desires if the aboleth can see the creature.",
                },
            ],
            actions: [
                {
                    name: 'Multiattack',
                    description: 'The aboleth makes three tentacle attacks.',
                    type: 'common',
                },
                {
                    name: 'Tentacle',
                    description:
                        "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased. The disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature's skin becomes translucent and slimy, the creature can't regain hit points unless it is underwater, and the disease can be removed only by heal or another disease-curing spell of 6th level or higher. When the creature is outside a body of water, it takes 6 (1d12) acid damage every 10 minutes unless moisture is applied to the skin before 10 minutes have passed.",
                    type: 'common',
                },
                {
                    name: 'Tail',
                    description:
                        'Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 15 (3d6 + 5) bludgeoning damage.',
                    type: 'common',
                },
                {
                    name: 'Enslave (3/Day)',
                    description:
                        "The aboleth targets one creature it can see within 30 feet of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. The charmed target is under the aboleth's control and can't take reactions, and the aboleth and the target can communicate telepathically with each other over any distance.\n\nWhenever the charmed target takes damage, the target can repeat the saving throw. On a success, the effect ends. No more than once every 24 hours, the target can also repeat the saving throw when it is at least 1 mile away from the aboleth.",
                    type: 'common',
                },
                {
                    name: 'Legendary Actions',
                    description:
                        "The aboleth can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The aboleth regains spent legendary actions at the start of its turn.",
                    type: 'legendary',
                },
                {
                    name: 'Detect',
                    description: 'The aboleth makes a Wisdom (Perception) check.',
                    type: 'legendary',
                },
                {
                    name: 'Tail Swipe',
                    description: 'The aboleth makes one tail attack.',
                    type: 'legendary',
                },
                {
                    name: 'Psychic Drain (Costs 2 Actions)',
                    description:
                        'One creature charmed by the aboleth takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage the creature takes.',
                    type: 'legendary',
                },
            ],
            picture: 'https://i.ibb.co/GMGdPht/tumblr-oh3dew-Z0-RW1v9qvuco1-1280.jpg',
        },
        pt: {
            name: 'Aboleth',
            characteristics: ['grande aberração', 'malígno e leal'],
            stats: {
                armorClass: 17,
                hitPoints: {
                    hitDice: '18d10 + 36',
                    default: 135,
                },
                speed: '3 metros, nadar 12.1 metros',
                savingThrows: [
                    {
                        name: 'constituição',
                        value: 6,
                    },
                    {
                        name: 'inteligência',
                        value: 8,
                    },
                    {
                        name: 'sabedoria',
                        value: 6,
                    },
                ],
                damageImmunities: [],
                conditionImmunities: [],
                damageResistances: [],
                senses: ['visão no escuro 36.5 metros, Percepção passiva 20'],
                languages: ['fala profunda', 'telepatia 36.5 metros'],
                challengeLevel: 10,
            },
            abilityScore: [
                {
                    name: 'força',
                    value: 21,
                    modifier: 5,
                },
                {
                    name: 'destreza',
                    value: 9,
                    modifier: -1,
                },
                {
                    name: 'constituição',
                    value: 15,
                    modifier: 2,
                },
                {
                    name: 'inteligência',
                    value: 18,
                    modifier: 4,
                },
                {
                    name: 'sabedoria',
                    value: 15,
                    modifier: 2,
                },
                {
                    name: 'carisma',
                    value: 18,
                    modifier: 4,
                },
            ],
            skills: [
                {
                    name: 'Anfíbio',
                    description: 'O aboleth pode respirar ar e água.',
                },
                {
                    name: 'Nuvem de Muco',
                    description:
                        "Enquanto estiver submerso, o aboleth é cercado por um muco transformador. Uma criatura que toque o aboleth ou o atinja com um ataque corpo-a-corpo a até 1.5 metros dele deve fazer um teste de resistência de Constituição CD 14. Em caso de falha, a criatura fica doente por 1d4 horas e só pode respirar debaixo d'água.",
                },
                {
                    name: 'Telepatia de Sonda',
                    description:
                        'Se uma criatura se comunicar telepaticamente com o aboleth, o aboleth descobre os maiores desejos da criatura, se puder vê-la.',
                },
            ],
            actions: [
                {
                    name: 'Multiataque',
                    description: 'O aboleth faz três ataques com seus tentáculos.',
                    type: 'comum',
                },
                {
                    name: 'Tentáculo',
                    description:
                        "Ataque Corpo-a-Corpo: +9 para atingir, alcance 3 metros, um alvo. Acerto: 12 (2d6 + 5) de dano concussão. Se o alvo for uma criatura, ele deve ser bem-sucedido em um teste de resistência de Constituição CD 14 ou ficará doente. A doença não tem efeito durante 1 minuto e pode ser removida por qualquer magia que cure doenças. Após 1 minuto, a pele da criatura doente fica translúcida e viscosa, e ela não pode recuperar pontos de vida, a menos que esteja debaixo d'água, e a doença só pode ser removida por magia cura ou outra magia de cura de doenças de 6º nível ou superior. Quando a criatura está fora da água, ela sofre 6 (1d12) de dano ácido a cada 10 minutos, a menos que a pele seja umedecida antes de 10 minutos passarem.",
                    type: 'comum',
                },
                {
                    name: 'Cauda',
                    description:
                        'Ataque Corpo-a-Corpo: +9 para atingir, alcance 3 metros, um alvo. Acerto: 15 (3d6 + 5) de dano concussão.',
                    type: 'comum',
                },
                {
                    name: 'Escravizar (3/Vezes ao Dia)',
                    description:
                        'O aboleth escolhe uma criatura que pode ver a até 9.1 metros dele. O alvo deve ser bem-sucedido em um teste de resistência de Sabedoria CD 14 ou ficará enfeitiçado magicamente pelo aboleth até que o aboleth morra ou até que o alvo esteja em um plano diferente de existência em relação ao aboleth. O alvo enfeitiçado está sob o controle do aboleth e não pode reagir, e o aboleth e o alvo podem se comunicar telepaticamente um com o outro, em qualquer distância.\n\nSempre que o alvo enfeitiçado sofrer dano, ele pode repetir o teste de resistência. Em caso de sucesso, o efeito termina. No máximo uma vez a cada 24 horas, o alvo pode repetir o teste de resistência quando estiver a pelo menos 1 milha do aboleth.',
                    type: 'comum',
                },
                {
                    name: 'Ações Lendárias',
                    description:
                        'O aboleth pode fazer 3 ações lendárias, escolhendo entre as opções abaixo. Somente uma opção de ação lendária pode ser usada de cada vez e somente no final do turno de outra criatura. O aboleth recupera as ações lendárias gastas no início de seu turno.',
                    type: 'lendário',
                },
                {
                    name: 'Detectar',
                    description: 'O aboleth faz um teste de Sabedoria (Percepção).',
                    type: 'lendário',
                },
                {
                    name: 'Golpe de Cauda',
                    description: 'O aboleth faz um ataque com a cauda.',
                    type: 'lendário',
                },
                {
                    name: 'Dreno Psíquico (Custa 2 Ações)',
                    description:
                        'Uma criatura enfeitiçada pelo aboleth sofre 10 (3d6) de dano psíquico, e o aboleth recupera pontos de vida iguais ao dano causado à criatura.',
                    type: 'lendário',
                },
            ],
            picture: 'https://i.ibb.co/GMGdPht/tumblr-oh3dew-Z0-RW1v9qvuco1-1280.jpg',
        },
    };
}

const dungeonsAndDragonsFunctions = {
    armors: createArmorsFaker,
    backgrounds: createBackgroundsFaker,
    classes: createClassesFaker,
    feats: createFeatsFaker,
    gods: createGodsFaker,
    magicItems: createMagicItemsFaker,
    monsters: createMonstersFaker,
};

export default function generateDungeonsAndDragonsFaker({
    count,
    entityId,
    entity,
}: {
    count: number;
    entityId: string | undefined;
    entity: string | undefined;
}): any[] {
    const entityArray: Array<
        Internacional<Armor | Background | Class | Feat | MagicItem | Monster>
    > = [];

    for (let index = 0; index <= count; index += 1) {
        entityArray.push(
            dungeonsAndDragonsFunctions[
                entity as keyof typeof dungeonsAndDragonsFunctions
            ]({ entityId } as { entityId: string })
        );
    }

    return entityArray;
}
