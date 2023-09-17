import armorZod from "./armorsValidationSchema";
import backgroundZod from "./backgroundsValidationSchema";
import classZod from "./classesValidationSchema";
import featZod from "./featsValidationSchema";
import godZod from "./godsValidationSchema";
import itemZod from "./itemsValidationSchema";
import magicItemZod from "./magicItemsValidationSchema";
import monsterZod from "./monstersValidationSchema";
import raceZod from "./racesValidationSchema";
import realmZod from "./realmsValidationSchema";
import spellZod from "./spellsValidationSchema";
import systemZod, { systemPayloadZodSchema } from "./systemValidationSchema";
import weaponZod from "./weaponsValidationSchema";
import wikiZod from "./wikisValidationSchema";

export default {
    armorZod,
    backgroundZod,
    classZod,
    featZod,
    godZod,
    itemZod,
    magicItemZod,
    monsterZod,
    raceZod,
    realmZod,
    spellZod,
    systemZod: { systemZod, systemPayloadZodSchema },
    weaponZod,
    wikiZod
}