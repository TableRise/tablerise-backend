import CharactersController from 'src/interface/characters/presentation/character/CharactersController';
import AuthorizationMiddleware from 'src/interface/common/middlewares/AuthorizationMiddleware';
import ImageMiddleware from 'src/interface/common/middlewares/ImageMiddleware';
import VerifyIdMiddleware from 'src/interface/common/middlewares/VerifyIdMiddleware';

export interface CharactersRoutesContract {
    charactersController: CharactersController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
    imageMiddleware: ImageMiddleware;
    authorizationMiddleware: AuthorizationMiddleware;
}
