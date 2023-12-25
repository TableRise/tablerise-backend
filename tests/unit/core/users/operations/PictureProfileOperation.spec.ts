import sinon from 'sinon';
import PictureProfileOperation from 'src/core/users/operations/users/PictureProfileOperation';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { FileObject } from 'src/types/File';

describe('Core :: Users :: Operation :: Users :: PictureProfileOperation', () => {
    let pictureProfileOperation: PictureProfileOperation,
        pictureProfileService: any,
        user: UserInstance;

    const logger = (): void => {};

    context('When a profile has the picture updated', () => {
        before(() => {
            user = DomainDataFaker.generateUsersJSON()[0];

            user.picture = { id: '', link: '123', uploadDate: new Date() };

            pictureProfileService = {
                uploadPicture: sinon.spy(() => user),
            };

            pictureProfileOperation = new PictureProfileOperation({
                pictureProfileService,
                logger,
            });
        });

        it('should call correct methods and return correct data', async () => {
            const payload = {
                userId: user.userId,
                image: '' as unknown as FileObject,
            };

            const userWithPicture = await pictureProfileOperation.execute(payload);

            expect(pictureProfileService.uploadPicture).to.have.been.calledWith(payload);
            expect(userWithPicture).to.be.deep.equal(user);
        });
    });
});
