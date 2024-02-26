import { Request, Response } from 'express';
import sinon from 'sinon';
import DungeonsAndDragonsRoutesMiddleware from 'src/interface/dungeons&dragons5e/middlewares/DungeonsAndDragonsRoutesMiddleware';

describe('Interface :: DungeonsAndDragons :: Middlewares :: DungeonsAndDragonsRoutesMiddleware', () => {
    let dungeonsAndDragonsRoutesMiddleware: DungeonsAndDragonsRoutesMiddleware,
        routesWrapper: any;

    context('When the correct routes are wrapped in the middleware', () => {
        beforeEach(() => {
            routesWrapper = {
                routes: sinon.spy(() => ({
                    'dungeons&dragons5e': {
                        armors: (req: Request, res: Response) => {},
                        backgrounds: (req: Request, res: Response) => {},
                        classes: (req: Request, res: Response) => {},
                        feats: (req: Request, res: Response) => {},
                        gods: (req: Request, res: Response) => {},
                        items: (req: Request, res: Response) => {},
                        magicItems: (req: Request, res: Response) => {},
                        monsters: (req: Request, res: Response) => {},
                        races: (req: Request, res: Response) => {},
                        realms: (req: Request, res: Response) => {},
                        spells: (req: Request, res: Response) => {},
                    },
                })),
            };

            dungeonsAndDragonsRoutesMiddleware = new DungeonsAndDragonsRoutesMiddleware({
                routesWrapper,
            });
        });

        it('should return correct routes', () => {
            const routes = dungeonsAndDragonsRoutesMiddleware.get();

            expect(routesWrapper.routes).to.have.been.called(11);
            expect(routes.stack).to.have.lengthOf(11);
            expect(routes.stack[0].name).to.be.equal('armors');
            expect(routes.stack[1].name).to.be.equal('backgrounds');
            expect(routes.stack[2].name).to.be.equal('classes');
            expect(routes.stack[3].name).to.be.equal('feats');
            expect(routes.stack[4].name).to.be.equal('gods');
            expect(routes.stack[5].name).to.be.equal('items');
            expect(routes.stack[6].name).to.be.equal('magicItems');
            expect(routes.stack[7].name).to.be.equal('monsters');
            expect(routes.stack[8].name).to.be.equal('races');
            expect(routes.stack[9].name).to.be.equal('realms');
            expect(routes.stack[10].name).to.be.equal('spells');
        });
    });
});
