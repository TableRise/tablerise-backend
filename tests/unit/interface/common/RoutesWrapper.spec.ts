import RoutesWrapper from 'src/interface/common/RoutesWrapper';

describe('Interefaces :: Common :: RoutesWrapper', () => {
    let routesWrapper: RoutesWrapper,
        usersRoutesBuilder: any,
        dungeonsAndDragonsRoutesBuilder: any;

    context('#routes', () => {
        beforeEach(() => {
            usersRoutesBuilder = {
                get: () => ({
                    usersRoutes: 'user',
                }),
            };

            dungeonsAndDragonsRoutesBuilder = {
                get: () => ({
                    dungeonsAndDragonsRoutes: 'dnd5e',
                }),
            };

            routesWrapper = new RoutesWrapper({
                usersRoutesBuilder,
                dungeonsAndDragonsRoutesBuilder,
            });
        });

        it('should return correct routes', () => {
            const routes = routesWrapper.routes();

            expect(routes).to.have.property('user');
            expect(routes).to.have.property('dungeons&dragons5e');
            expect(routes.user).to.be.equal('user');
            expect(routes['dungeons&dragons5e']).to.be.equal('dnd5e');
        });
    });

    context('#declareRoutes', () => {
        beforeEach(() => {
            usersRoutesBuilder = {
                get: () => ({
                    usersSwagger: ['user', 'user2'],
                }),
            };

            dungeonsAndDragonsRoutesBuilder = {
                get: () => ({
                    dungeonsAndDragonsSwagger: ['dnd5e', 'dnd5e2'],
                }),
            };

            routesWrapper = new RoutesWrapper({
                usersRoutesBuilder,
                dungeonsAndDragonsRoutesBuilder,
            });
        });

        it('should return correct routes', () => {
            const routes = routesWrapper.declareRoutes();

            expect(routes).to.have.property('user');
            expect(routes).to.have.property('dungeons&dragons5e');
            expect(routes.user).to.be.an('array').that.has.length(2);
            expect(routes['dungeons&dragons5e']).to.be.an('array').that.has.length(2);
            expect(routes.user[0]).to.be.equal('user');
            expect(routes.user[1]).to.be.equal('user2');
            expect(routes['dungeons&dragons5e'][0]).to.be.equal('dnd5e');
            expect(routes['dungeons&dragons5e'][1]).to.be.equal('dnd5e2');
        });
    });
});
