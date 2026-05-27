/* eslint-disable no-console */
import { Router, Request, Response } from 'express';
import autoSwagger from '@tablerise/auto-swagger';
import logger from '@tablerise/dynamic-logger';
import RoutesWrapper from 'src/interface/common/RoutesWrapper';
import swaggerUI from 'swagger-ui-express';

export default ({ routesWrapper }: { routesWrapper: RoutesWrapper }): Router => {
    const router = Router();
    const urls = [process.env.SWAGGER_URL as string];
    const pathLevel = process.env.SWAGGER_PATH_LEVEL as string;
    const mountSwaggerRoute = (routePath: string, swaggerDocument: any): void => {
        const swaggerOptions = {
            swaggerOptions: {
                url: `${routePath}/swagger.json`,
            },
        };

        router.get(`${routePath}/swagger.json`, (_req: Request, res: Response) => {
            res.json(swaggerDocument);
        });
        router.use(
            routePath,
            swaggerUI.serveFiles(undefined, swaggerOptions),
            swaggerUI.setup(undefined, swaggerOptions)
        );
    };

    autoSwagger(routesWrapper.declareRoutes()['dungeons&dragons5e'], {
        title: 'dungeons&dragons5e',
        url: urls,
    })
        .then((_result: any) => {
            logger('info', 'SwaggerGenerator - dungeons&dragons5e - document generated');

            const SwaggerDocumentDnD5E = require(`${pathLevel}/api-docs/swagger-doc-dungeons&dragons5e.json`);
            mountSwaggerRoute('/api-docs/system/dnd5e', SwaggerDocumentDnD5E);
        })
        .catch((error: any) => {
            console.log(error);
        });

    autoSwagger(routesWrapper.declareRoutes().user, {
        title: 'users',
        url: urls,
    })
        .then((_result: any) => {
            logger('info', 'SwaggerGenerator - users - document generated');

            const SwaggerDocumentUser = require(`${pathLevel}/api-docs/swagger-doc-users.json`);
            mountSwaggerRoute('/api-docs/users', SwaggerDocumentUser);
        })
        .catch((error: any) => {
            console.log(error);
        });

    autoSwagger(routesWrapper.declareRoutes().campaign, {
        title: 'campaigns',
        url: urls,
    })
        .then((_result: any) => {
            logger('info', 'SwaggerGenerator - campaigns - document generated');

            const SwaggerDocumentCampaign = require(`${pathLevel}/api-docs/swagger-doc-campaigns.json`);
            mountSwaggerRoute('/api-docs/campaigns', SwaggerDocumentCampaign);
        })
        .catch((error: any) => {
            console.log(error);
        });

    autoSwagger(routesWrapper.declareRoutes().character, {
        title: 'characters',
        url: urls,
    })
        .then((_result: any) => {
            logger('info', 'SwaggerGenerator - characters - document generated');

            const SwaggerDocumentCharacters = require(`${pathLevel}/api-docs/swagger-doc-characters.json`);
            mountSwaggerRoute('/api-docs/characters', SwaggerDocumentCharacters);
        })
        .catch((error: any) => {
            console.log(error);
        });

    return router;
};
