import UpdateCharacterPictureService from 'src/core/characters/services/UpdateCharacterPictureService';
import Sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { FileObject } from 'src/types/shared/file';
import { UpdateCharacterPicturePayload } from 'src/types/api/characters/http/payload';

describe('Core :: Characters :: Services :: UpdateCharacterPictureService', () => {
    const logger = (): void => {};
    const createInternalRepository = () => ({
        imagesForDeletion: [] as string[],
        addImageForDeletion(image?: { deleteUrl?: string; delete_url?: string } | null) {
            const deleteUrl = image?.deleteUrl ?? image?.delete_url;
            if (deleteUrl) this.imagesForDeletion.push(deleteUrl);
        },
    });

    it('should update the character picture and append it to the uploader gallery', async () => {
        const payload: UpdateCharacterPicturePayload = {
            characterId: 'character-1',
            userId: 'user-1',
            image: {} as FileObject,
        };
        const uploaded = {
            id: 'image-1',
            link: 'https://img.bb/character',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };
        const userDetails = {
            userDetailId: 'detail-1',
            gallery: [],
        };

        const charactersRepository = {
            findOne: Sinon.stub().resolves({
                picture: '',
                characterId: 'character-1',
            }),
            update: Sinon.stub().resolves({}),
        };
        const usersDetailsRepository = {
            findOne: Sinon.stub().resolves(userDetails),
            update: Sinon.stub().resolves(userDetails),
        };
        const imageStorageClient = { upload: Sinon.stub().resolves(uploaded) };
        const internalRepository = createInternalRepository();

        const service = new UpdateCharacterPictureService({
            logger,
            charactersRepository,
            usersDetailsRepository,
            imageStorageClient,
            internalRepository,
        } as any);

        await service.uploadPicture(payload);

        expect(charactersRepository.findOne).to.have.been.calledWith({ characterId: payload.characterId });
        expect(imageStorageClient.upload).to.have.been.calledWith(payload.image);
        expect(usersDetailsRepository.update).to.have.been.calledWith({
            query: { userDetailId: 'detail-1' },
            payload: userDetails,
        });
        expect(userDetails.gallery).to.deep.equal([uploaded]);
        expect(internalRepository.imagesForDeletion).to.deep.equal([]);
        expect(charactersRepository.update).to.have.been.calledWith({
            query: { characterId: 'character-1' },
            payload: Sinon.match.object,
        });
    });

    it('should bubble repository and upload errors', async () => {
        const service = new UpdateCharacterPictureService({
            logger,
            charactersRepository: {
                findOne: Sinon.stub().rejects(new Error('Character not found')),
                update: Sinon.stub(),
            },
            usersDetailsRepository: {
                findOne: Sinon.stub(),
                update: Sinon.stub(),
            },
            internalRepository: createInternalRepository(),
            imageStorageClient: { upload: Sinon.stub() },
        } as any);

        try {
            await service.uploadPicture({
                characterId: 'character-1',
                userId: 'user-1',
                image: {} as FileObject,
            });
        } catch (error: unknown) {
            expect((error as Error).message).to.equal('Character not found');
        }
    });

    it('should use the provided imageObject without calling image storage', async () => {
        const uploaded = {
            id: 'image-1',
            link: 'https://img.bb/character',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };
        const userDetails = { userDetailId: 'detail-1', gallery: [] };
        const imageStorageClient = { upload: Sinon.stub().resolves(uploaded) };
        const internalRepository = createInternalRepository();
        const service = new UpdateCharacterPictureService({
            logger,
            charactersRepository: {
                findOne: Sinon.stub().resolves({
                    picture: '',
                    characterId: 'character-1',
                }),
                update: Sinon.stub().resolves({}),
            },
            usersDetailsRepository: {
                findOne: Sinon.stub().resolves(userDetails),
                update: Sinon.stub().resolves({}),
            },
            imageStorageClient,
            internalRepository,
        } as any);

        await service.uploadPicture({
            characterId: 'character-1',
            userId: 'user-1',
            imageObject: uploaded,
        });

        expect(imageStorageClient.upload).to.not.have.been.called();
        expect(userDetails.gallery).to.deep.equal([]);
        expect(internalRepository.imagesForDeletion).to.deep.equal([]);
    });

    it('should reject character picture updates without an image file or imageObject', async () => {
        const service = new UpdateCharacterPictureService({
            logger,
            charactersRepository: {
                findOne: Sinon.stub().resolves({
                    picture: '',
                    characterId: 'character-1',
                }),
                update: Sinon.stub(),
            },
            usersDetailsRepository: {
                findOne: Sinon.stub(),
                update: Sinon.stub(),
            },
            internalRepository: createInternalRepository(),
            imageStorageClient: { upload: Sinon.stub() },
        } as any);

        try {
            await service.uploadPicture({
                characterId: 'character-1',
                userId: 'user-1',
            } as any);
            expect('it should not be here').to.equal(false);
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.code).to.equal(HttpStatusCode.BAD_REQUEST);
            expect(err.message).to.equal('An image file or imageObject is required');
        }
    });

    it('should reject character picture updates when the uploader user details do not exist', async () => {
        const uploaded = {
            id: 'image-1',
            link: 'https://img.bb/character',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };
        const service = new UpdateCharacterPictureService({
            logger,
            charactersRepository: {
                findOne: Sinon.stub().resolves({
                    picture: '',
                    characterId: 'character-1',
                }),
                update: Sinon.stub(),
            },
            usersDetailsRepository: {
                findOne: Sinon.stub().resolves(null),
                update: Sinon.stub(),
            },
            internalRepository: createInternalRepository(),
            imageStorageClient: { upload: Sinon.stub() },
        } as any);

        try {
            await service.uploadPicture({
                characterId: 'character-1',
                userId: 'user-1',
                imageObject: uploaded,
            } as any);
            expect('it should not be here').to.equal(false);
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
            expect(err.message).to.equal('User does not exist');
        }
    });

    it('should queue the previous character picture deleteUrl when replacing it', async () => {
        const uploaded = {
            id: 'image-1',
            link: 'https://img.bb/character',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };
        const userDetails = { userDetailId: 'detail-1', gallery: [] };
        const internalRepository = createInternalRepository();

        const service = new UpdateCharacterPictureService({
            logger,
            charactersRepository: {
                findOne: Sinon.stub().resolves({
                    picture: {
                        id: 'old-image',
                        link: 'https://img.bb/old-character',
                        uploadDate: new Date().toISOString(),
                        title: '',
                        deleteUrl: 'https://img.bb/delete-old-character',
                        request: { success: true, status: 200 },
                    },
                    characterId: 'character-1',
                }),
                update: Sinon.stub().resolves({}),
            },
            usersDetailsRepository: {
                findOne: Sinon.stub().resolves(userDetails),
                update: Sinon.stub().resolves({}),
            },
            imageStorageClient: { upload: Sinon.stub().resolves(uploaded) },
            internalRepository,
        } as any);

        await service.uploadPicture({
            characterId: 'character-1',
            userId: 'user-1',
            image: {} as FileObject,
        });

        expect(internalRepository.imagesForDeletion).to.deep.equal(['https://img.bb/delete-old-character']);
    });
});
