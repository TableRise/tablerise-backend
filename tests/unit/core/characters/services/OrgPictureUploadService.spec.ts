import OrgPictureUploadService from 'src/core/characters/services/OrgPictureUploadService';
import Sinon from 'sinon';
import { FileObject } from 'src/types/shared/file';
import { orgPicturePayload } from 'src/types/api/characters/http/payload';

describe('Core :: Characters :: Services :: OrgPictureUploadService', () => {
    let orgPictureUploadService: OrgPictureUploadService,
        charactersRepository: any,
        imageStorageClient: any,
        payload: orgPicturePayload;

    const logger = (): void => {};

    context('When a picture is uploaded to organization', () => {
        beforeEach(() => {
            payload = {
                orgName: 'string',
                characterId: 'string',
                image: {} as FileObject,
            };

            charactersRepository = {
                findOne: Sinon.stub().resolves({
                    data: {
                        profile: {
                            characteristics: {
                                alliesAndOrgs: [{ orgName: 'string', symbol: '' }],
                            },
                        },
                    },
                    characterId: 'string',
                }),
                update: Sinon.stub().resolves({}),
            };

            imageStorageClient = { upload: Sinon.stub().resolves('image-url') };

            orgPictureUploadService = new OrgPictureUploadService({
                logger,
                charactersRepository,
                imageStorageClient,
            });
        });

        it('should update the organization picture', async () => {
            await orgPictureUploadService.uploadPicture(payload);

            expect(charactersRepository.findOne).to.have.been.calledWith({
                characterId: payload.characterId,
            });
            expect(imageStorageClient.upload).to.have.been.calledWith(payload.image);
            expect(charactersRepository.update).to.have.been.calledWith({
                query: { characterId: 'string' },
                payload: Sinon.match.object,
            });
        });

        it('should throw an error if character is not found', async () => {
            charactersRepository.findOne.rejects(new Error('Character not found'));

            try {
                await orgPictureUploadService.uploadPicture(payload);
            } catch (error: unknown) {
                expect((error as Error).message).to.equal('Character not found');
            }
        });

        it('should throw an error if organization is not found', async () => {
            charactersRepository.findOne.resolves({
                data: {
                    profile: {
                        characteristics: {
                            alliesAndOrgs: [],
                        },
                    },
                },
                characterId: 'string',
            });

            try {
                await orgPictureUploadService.uploadPicture(payload);
            } catch (error: unknown) {
                expect((error as Error).message).to.equal('Organization not found');
            }
        });

        it('should throw an error if image upload fails', async () => {
            imageStorageClient.upload.rejects(new Error('Image upload failed'));

            try {
                await orgPictureUploadService.uploadPicture(payload);
            } catch (error: unknown) {
                expect((error as Error).message).to.equal('Image upload failed');
            }
        });

        it('should throw an error if repository update fails', async () => {
            charactersRepository.update.rejects(new Error('Update failed'));

            try {
                await orgPictureUploadService.uploadPicture(payload);
            } catch (error: unknown) {
                expect((error as Error).message).to.equal('Update failed');
            }
        });
    });
});
