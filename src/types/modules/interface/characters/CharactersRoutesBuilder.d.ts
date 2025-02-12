import CharactersRoutes from 'src/interface/characters/presentation/character/CharactersRoutes';
import VerifyUserMiddleware from 'src/interface/common/middlewares/VerifyUserMiddleware';

export interface CharactersRoutesBuilderContract {
    charactersRoutes: CharactersRoutes;
    verifyUserMiddleware: VerifyUserMiddleware;
}
