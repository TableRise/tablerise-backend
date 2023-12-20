import ArmorsRoutes from 'src/interface/dungeons&dragons5e/presentation/armors/ArmorsRoutes';
import BackgroundRoutes from 'src/interface/dungeons&dragons5e/presentation/backgrounds/BackgroundsRoutes';
import ClassRoutes from 'src/interface/dungeons&dragons5e/presentation/classes/ClassesRoutes';
import FeatsRoutes from 'src/interface/dungeons&dragons5e/presentation/feats/FeatsRoutes';
import GodsRoutes from 'src/interface/dungeons&dragons5e/presentation/gods/GodsRoutes';
import ItemsRoutes from 'src/interface/dungeons&dragons5e/presentation/items/ItemsRoutes';
import RacesRoutes from 'src/interface/dungeons&dragons5e/presentation/races/RacesRoutes';
import RealmsRoutes from 'src/interface/dungeons&dragons5e/presentation/realms/RealmsRoutes';
import MagicItemsRoutes from 'src/interface/dungeons&dragons5e/presentation/magicItems/MagicItemsRoutes';
import MonstersRoutes from 'src/interface/dungeons&dragons5e/presentation/monsters/MonstersRoutes';
import SpellsRoutes from 'src/interface/dungeons&dragons5e/presentation/spells/SpellsRoutes';
import WeaponsRoutes from 'src/interface/dungeons&dragons5e/presentation/weapons/WeaponsRoutes';
import WikisRoutes from 'src/interface/dungeons&dragons5e/presentation/wikis/WikisRoutes';

export interface DungeonsAndDragonsRoutesBuilderContract {
    armorsRoutes: ArmorsRoutes;
    backgroundsRoutes: BackgroundRoutes;
    classesRoutes: ClassRoutes;
    featsRoutes: FeatsRoutes;
    godsRoutes: GodsRoutes;
    itemsRoutes: ItemsRoutes;
    racesRoutes: RacesRoutes;
    realmsRoutes: RealmsRoutes;
    magicItemsRoutes: MagicItemsRoutes;
    monstersRoutes: MonstersRoutes;
    spellsRoutes: SpellsRoutes;
    weaponsRoutes: WeaponsRoutes;
    wikisRoutes: WikisRoutes;
}
