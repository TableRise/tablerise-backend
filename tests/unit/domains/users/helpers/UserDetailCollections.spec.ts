import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import {
    appendGalleryImage,
    ensureUserDetailCollections,
    getFriendStatus,
} from 'src/domains/users/helpers/UserDetailCollections';

describe('Domains :: Users :: Helpers :: UserDetailCollections', () => {
    it('should initialize missing collection arrays on one user detail', () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0] as any;
        delete userDetails.messages;
        delete userDetails.gallery;
        delete userDetails.friends;

        const result = ensureUserDetailCollections(userDetails);

        expect(result.messages).to.deep.equal([]);
        expect(result.gallery).to.deep.equal([]);
        expect(result.friends).to.deep.equal([]);
    });

    it('should append one image to the user gallery', () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.gallery = [];
        const image = {
            id: 'img-1',
            title: '',
            link: 'https://img.bb/1',
            uploadDate: new Date().toISOString(),
            deleteUrl: '',
            request: { success: true, status: 200 },
        };

        appendGalleryImage(userDetails, image as any);

        expect(userDetails.gallery).to.deep.equal([image]);
    });

    it('should expose pending status and fallback missing status to active', () => {
        expect(
            getFriendStatus({
                userId: 'user-1',
                nickname: 'user-1',
                tag: '#1001',
                picture: '',
                rank: 'bronze',
                status: 'pending',
            } as any)
        ).to.equal('pending');
        expect(
            getFriendStatus({
                userId: 'user-2',
                nickname: 'user-2',
                tag: '#1002',
                picture: '',
                rank: 'bronze',
            } as any)
        ).to.equal('active');
    });
});
