import OAuthRoutes from 'src/interface/users/presentation/oauth/OAuthRoutes';
import UsersRoutes from 'src/interface/users/presentation/users/UsersRoutes';

export interface UsersRoutesBuilderContract {
    usersRoutes: UsersRoutes;
    oAuthRoutes: OAuthRoutes;
}
