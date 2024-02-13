// import sinon from 'sinon';
// import GetAllBackgroundsService from 'src/core/dungeons&dragons5e/services/backgrounds/GetAllBackgroundsService';
// import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

// describe('Core :: Dungeons&Dragons5e :: Operations :: Backgrounds :: GetAllBackgroundsService', () => {
//     let getAllBackgroundsService: GetAllBackgroundsService,
//         getAllBackgroundsRepository: any,
//         backgrounds: any;

//     const logger = (): void => {};

//     context('', () => {
//         backgrounds = DomainDataFaker.generateDungeonsAndDragonsJSON({
//             count: 1,
//             entity: 'backgrounds',
//         });

//         getAllBackgroundsRepository = {
//             setEntity: sinon.spy(),
//             find: sinon.spy(() => backgrounds),
//         };

//         getAllBackgroundsService = new GetAllBackgroundsService({
//             getAllBackgroundsRepository,
//             logger,
//         });

//         it('', async () => {
//             const result = await getAllBackgroundsService.getAll();

//             expect(getAllBackgroundsRepository.find).to.have.been.called();
//             expect(result).to.be.deep.equal(backgrounds);
//         });
//     });
// });
