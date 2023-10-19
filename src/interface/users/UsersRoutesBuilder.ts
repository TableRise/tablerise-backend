import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import { UsersRoutesBuilderContract } from 'src/types/contracts/users/presentation/BuildRoutes';

const router = Router();

export default class UsersRoutesBuilder extends UsersRoutesBuilderContract {
    constructor({ usersRoutes }: UsersRoutesBuilderContract) {
        super();
        this.usersRoutes = usersRoutes;
    }

    private _profile(): { profileRoutes: Router, profileSwagger: routeInstance[] } {
        const profileRoutes = buildRouter(this.usersRoutes.routes(), router);
        const profileSwagger = this.usersRoutes.routes();

        return { profileRoutes, profileSwagger };
    }

    public get(): { usersSwagger: routeInstance[], usersRoutes: { profile: Router } } {
        const usersSwagger = [...this._profile().profileSwagger];
        const usersRoutes = {
            profile: this._profile().profileRoutes
        };

        return { usersSwagger, usersRoutes }
    }
}
