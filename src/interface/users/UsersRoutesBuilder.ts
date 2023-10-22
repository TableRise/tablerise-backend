import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import { UsersRoutesBuilderContract } from 'src/types/contracts/users/presentation/BuildRoutes';

const router = Router();

export default class UsersRoutesBuilder {
    private readonly _usersRoutes;

    constructor({ usersRoutes }: UsersRoutesBuilderContract) {
        this._usersRoutes = usersRoutes;
    }

    private _profile(): { profileRoutes: Router; profileSwagger: routeInstance[] } {
        const profileRoutes = buildRouter(this._usersRoutes.routes(), router);
        const profileSwagger = this._usersRoutes.routes();

        return { profileRoutes, profileSwagger };
    }

    public get(): { usersSwagger: routeInstance[]; usersRoutes: { profile: Router } } {
        const usersSwagger = [...this._profile().profileSwagger];
        const usersRoutes = {
            profile: this._profile().profileRoutes,
        };

        return { usersSwagger, usersRoutes };
    }
}
