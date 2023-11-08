import ArmorsRoutes from 'src/interface/dungeons&dragons5e/presentation/armors/ArmorsRoutes';
import BackgroundRoutes from 'src/interface/dungeons&dragons5e/presentation/backgrounds/BackgroundsRoutes';
import ClassRoutes from 'src/interface/dungeons&dragons5e/presentation/classes/ClassesRoutes';
import FeatRoutes from 'src/interface/dungeons&dragons5e/presentation/feats/FeatsRoutes';

export interface DungeonsAndDragonsRoutesBuilderContract {
    armorsRoutes: ArmorsRoutes;
    backgroundsRoutes: BackgroundRoutes;
    classesRoutes: ClassRoutes;
    featsRoutes: FeatRoutes;
}
