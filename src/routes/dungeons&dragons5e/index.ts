import systemRoutes from 'src/routes/dungeons&dragons5e/systemRoutes';
import realmRoutes from 'src/routes/dungeons&dragons5e/realmRoutes';
import godRoutes from 'src/routes/dungeons&dragons5e/godRoutes';
import backgroundRoutes from 'src/routes/dungeons&dragons5e/backgroundRoutes';
import featRoutes from 'src/routes/dungeons&dragons5e/featRoutes';
import weaponRoutes from 'src/routes/dungeons&dragons5e/weaponRoutes';
import armorRoutes from 'src/routes/dungeons&dragons5e/armorRoutes';
import itemRoutes from 'src/routes/dungeons&dragons5e/itemsRoutes';
import raceRoutes from 'src/routes/dungeons&dragons5e/racesRoutes';
import classRoutes from 'src/routes/dungeons&dragons5e/classRoutes';
import magicItemRoutes from 'src/routes/dungeons&dragons5e/magicItemsRoutes';
import spellRoutes from 'src/routes/dungeons&dragons5e/spellRoutes';
import wikiRoutes from 'src/routes/dungeons&dragons5e/wikiRoutes';
import monsterRoutes from 'src/routes/dungeons&dragons5e/monsterRoutes';

export const dungeonsAndDragonsSwagger = [
    ...systemRoutes.routesSwagger,
    ...realmRoutes.routesSwagger,
    ...godRoutes.routesSwagger,
    ...backgroundRoutes.routesSwagger,
    ...featRoutes.routesSwagger,
    ...weaponRoutes.routesSwagger,
    ...armorRoutes.routesSwagger,
    ...itemRoutes.routesSwagger,
    ...raceRoutes.routesSwagger,
    ...classRoutes.routesSwagger,
    ...magicItemRoutes.routesSwagger,
    ...spellRoutes.routesSwagger,
    ...wikiRoutes.routesSwagger,
    ...monsterRoutes.routesSwagger,
];

export default {
    system: systemRoutes.routerExpress,
    realms: realmRoutes.routerExpress,
    gods: godRoutes.routerExpress,
    backgrounds: backgroundRoutes.routerExpress,
    feats: featRoutes.routerExpress,
    weapons: weaponRoutes.routerExpress,
    armors: armorRoutes.routerExpress,
    items: itemRoutes.routerExpress,
    races: raceRoutes.routerExpress,
    classes: classRoutes.routerExpress,
    magicItems: magicItemRoutes.routerExpress,
    spells: spellRoutes.routerExpress,
    wikis: wikiRoutes.routerExpress,
    monsters: monsterRoutes.routerExpress,
};
