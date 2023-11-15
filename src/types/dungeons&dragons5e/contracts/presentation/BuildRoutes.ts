import ArmorsRoutes from 'src/interface/dungeons&dragons5e/presentation/armors/ArmorsRoutes';
import BackgroundRoutes from 'src/interface/dungeons&dragons5e/presentation/backgrounds/BackgroundsRoutes';
import ClassRoutes from 'src/interface/dungeons&dragons5e/presentation/classes/ClassesRoutes';
import FeatRoutes from 'src/interface/dungeons&dragons5e/presentation/feats/FeatsRoutes';
import RacesRoutes from 'src/interface/dungeons&dragons5e/presentation/races/RacesRoutes';
import RealmsRoutes from 'src/interface/dungeons&dragons5e/presentation/realms/RealmsRoutes';
import MagicItemsRoutes from 'src/interface/dungeons&dragons5e/presentation/magicItems/MagicItemsRoutes';
import MonstersRoutes from 'src/interface/dungeons&dragons5e/presentation/monsters/MonstersRoutes';
import SpellsRoutes from 'src/interface/dungeons&dragons5e/presentation/spells/SpellsRoutes';

export interface DungeonsAndDragonsRoutesBuilderContract {
    armorsRoutes: ArmorsRoutes;
    backgroundsRoutes: BackgroundRoutes;
    classesRoutes: ClassRoutes;
    featsRoutes: FeatRoutes;
    racesRoutes: RacesRoutes;
    realmsRoutes: RealmsRoutes;
    magicItemsRoutes: MagicItemsRoutes;
    monstersRoutes: MonstersRoutes;
    spellsRoutes: SpellsRoutes;
}
