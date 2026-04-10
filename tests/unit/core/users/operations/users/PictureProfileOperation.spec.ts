import sinon from 'sinon';
import PictureProfileOperation from 'src/core/users/operations/users/PictureProfileOperation';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { FileObject } from 'src/types/shared/file';

describe('Core :: Users :: Operation :: Users :: PictureProfileOperation', () => {
    let pictureProfileOperation: PictureProfileOperation, pictureProfileService: any, user: User;

    const logger = (): void => {};

    context('When a profile has the picture updated', () => {
        before(() => {
            user = DomainDataFaker.generateUsersJSON()[0];

            user.picture = {
                id: '',
                title: '',
                link: '123',
                uploadDate: new Date().toISOString(),
                deleteUrl: '',
                request: { success: true, status: 200 },
            };

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
