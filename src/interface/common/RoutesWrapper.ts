// import dungeonsAndDragonsRoutes, { dungeonsAndDragonsSwagger } from 'src/routes/dungeons&dragons5e';
import Route, { RouteDeclarations } from 'src/types/modules/interface/common/Routes';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class RoutesWrapper {
    private readonly dungeonsAndDragonsRoutesBuilder;
    private readonly usersRoutesBuilder;
    private readonly campaignsRoutesBuilder;
    private readonly charactersRoutesBuilder;

    constructor({
        dungeonsAndDragonsRoutesBuilder,
        usersRoutesBuilder,
        campaignsRoutesBuilder,
        charactersRoutesBuilder,
    }: InterfaceDependencies['routesWrapperContract']) {
        this.dungeonsAndDragonsRoutesBuilder = dungeonsAndDragonsRoutesBuilder;
        this.usersRoutesBuilder = usersRoutesBuilder;
        this.campaignsRoutesBuilder = campaignsRoutesBuilder;
        this.charactersRoutesBuilder = charactersRoutesBuilder;
    }

    public routes(): Route {
        return {
            'dungeons&dragons5e': this.dungeonsAndDragonsRoutesBuilder.get().dungeonsAndDragonsRoutes,
            user: this.usersRoutesBuilder.get().usersRoutes,
            campaign: this.campaignsRoutesBuilder.get().campaignsRoutes,
            character: this.charactersRoutesBuilder.get().charactersRoutes,
        };
    }

    // prettier-ignore
    public declareRoutes(): RouteDeclarations {
    return {
            'dungeons&dragons5e': [...this.dungeonsAndDragonsRoutesBuilder.get().dungeonsAndDragonsSwagger ],
            user: [ ...this.usersRoutesBuilder.get().usersSwagger ],
            campaign: [ ...this.campaignsRoutesBuilder.get().campaignsSwagger ],
            character: [ ...this.charactersRoutesBuilder.get().charactersSwagger ]
        };
    }
}
