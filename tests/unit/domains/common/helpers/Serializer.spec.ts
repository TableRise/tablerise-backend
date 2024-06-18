import Google from 'passport-google-oauth20';
import Facebook from 'passport-facebook';
import Discord from 'passport-discord';
import newUUID from 'src/domains/common/helpers/newUUID';
import Serializer from 'src/domains/common/helpers/Serializer';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { ApiImgBBResponse } from 'src/types/modules/infra/clients/ImageStorageClient';

describe('Domains :: User :: Helpers :: Serializer', () => {
    let serializer: Serializer;

    context('When external user is serialized', () => {
        beforeEach(() => {
            serializer = new Serializer();
        });

        it('should return with correct keys - Google', () => {
            const user = {
                id: newUUID(),
                displayName: 'test',
                _json: { email: 'test@email.com' },
                provider: 'google',
            } as Google.Profile;

            const serialized = serializer.externalUser(user);

            expect(serialized).to.have.property('name');
            expect(serialized).to.have.property('email');
            expect(serialized).to.have.property('providerId');
            expect(serialized.name).to.be.equal('test');
            expect(serialized.email).to.be.equal('test@email.com');
            expect(serialized.providerId).to.be.equal(user.id);
        });

        it('should return with correct keys - Facebook', () => {
            const user = {
                id: newUUID(),
                displayName: 'test',
                _json: { email: 'test@email.com' },
                provider: 'facebook',
            } as Facebook.Profile;

            const serialized = serializer.externalUser(user);

            expect(serialized).to.have.property('name');
            expect(serialized).to.have.property('email');
            expect(serialized).to.have.property('providerId');
            expect(serialized.name).to.be.equal('test');
            expect(serialized.email).to.be.equal('test@email.com');
            expect(serialized.providerId).to.be.equal(user.id);
        });

        it('should return with correct keys - Discord', () => {
            const user = {
                id: newUUID(),
                username: 'test',
                email: 'test@email.com',
                provider: 'discord',
            } as Discord.Profile;

            const serialized = serializer.externalUser(user);

            expect(serialized).to.have.property('name');
            expect(serialized).to.have.property('email');
            expect(serialized).to.have.property('providerId');
            expect(serialized.name).to.be.equal('test');
            expect(serialized.email).to.be.equal('test@email.com');
            expect(serialized.providerId).to.be.equal(user.id);
        });
    });

    context('When user is serialized', () => {
        beforeEach(() => {
            serializer = new Serializer();
        });

        it('should return correct keys', () => {
            const userDefaultKeys = Object.keys(DomainDataFaker.generateUsersJSON()[0]);
            const user = {};
            const serialized = serializer.postUser(user);

            userDefaultKeys.forEach((key) => {
                expect(serialized).to.have.property(key);
            });
        });
    });

    context('When user details is serialized', () => {
        beforeEach(() => {
            serializer = new Serializer();
        });

        it('should return correct keys', () => {
            const userDetailsDefaultKeys = Object.keys(
                DomainDataFaker.generateUserDetailsJSON()[0]
            );
            const userDetails = {};
            const serialized = serializer.postUserDetails(userDetails);

            userDetailsDefaultKeys.forEach((key) => {
                expect(serialized).to.have.property(key);
            });
        });
    });

    context('When campaign is serialized', () => {
        beforeEach(() => {
            serializer = new Serializer();
        });

        it('should return correct keys', () => {
            const campaignDefault = CampaignDomainDataFaker.generateCampaignsJSON()[0];

            delete campaignDefault.visibility;

            const campaignDefaultKeys = Object.keys(campaignDefault);
            const campaign = {};
            const serialized = serializer.postCampaign(campaign);

            campaignDefaultKeys.forEach((key) => {
                expect(serialized).to.have.property(key);
            });
        });
    });

    context('When image is serialized', () => {
        beforeEach(() => {
            serializer = new Serializer();
        });

        it('should return correct keys', () => {
            const imageDefault = CampaignDomainDataFaker.generateImagesObjectJSON()[0];

            const imageDefaultKeys = Object.keys(imageDefault);
            const image = {
                data: {
                    thumb: {},
                    medium: {},
                },
                success: true,
                status: 200,
            } as ApiImgBBResponse;
            const serialized = serializer.imageResult(image);

            imageDefaultKeys.forEach((key) => {
                expect(serialized).to.have.property(key);
            });
        });

        it('should return correct keys - with time string', () => {
            const imageDefault = CampaignDomainDataFaker.generateImagesObjectJSON()[0];

            const imageDefaultKeys = Object.keys(imageDefault);
            const image = {
                data: {
                    time: new Date().getTime(),
                    thumb: {},
                    medium: {},
                },
                success: true,
                status: 200,
            } as ApiImgBBResponse;
            const serialized = serializer.imageResult(image);

            imageDefaultKeys.forEach((key) => {
                expect(serialized).to.have.property(key);
            });
        });
    });
});
