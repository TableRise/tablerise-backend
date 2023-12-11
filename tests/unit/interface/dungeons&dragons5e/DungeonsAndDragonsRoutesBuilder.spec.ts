import DungeonsAndDragonsRoutesBuilder from "src/interface/dungeons&dragons5e/DungeonsAndDragonsRoutesBuilder";
import ArmorsRoutes from "src/interface/dungeons&dragons5e/presentation/armors/ArmorsRoutes";
import BackgroundsRoutes from "src/interface/dungeons&dragons5e/presentation/backgrounds/BackgroundsRoutes";


describe('Interface :: DungeonsAndDragons :: Presentation :: DungeonsAndDragonsRoutesMiddleware', () => {
    let dungeonsAndDragonsRoutesBuilder = DungeonsAndDragonsRoutesBuilder;


    context('When dungeonsanddragonsroutesBuilder is processed', () => {


        it('should return correct routes and swagger reference', () => {
            const getRoutes = dungeonsAndDragonsRoutesBuilder.get();
            console.log('L10', getRoutes);
        });
    })
});