import SpellsController from 'src/interface/dungeons&dragons5e/presentation/spells/SpellsController';
import VerifyIdMiddleware from 'src/interface/users/middlewares/VerifyIdMiddleware';

export interface SpellsRoutesContract {
    spellsController: SpellsController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
}
