import Serializer from 'src/domains/campaigns/helpers/Serializer';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Domains :: Campaign :: Helpers :: Serializer', () => {
    let serializer: Serializer;

    context('When campaign is serialized', () => {
        beforeEach(() => {
            serializer = new Serializer();
        });

        it('should return correct keys', () => {
            const campaignDefaultKeys = Object.keys(DomainDataFaker.mocks.campaignMock);
            const campaign = {};
            const serialized = serializer.postCampaign(campaign);
            campaignDefaultKeys.forEach((key) => {
                expect(serialized).to.have.property(key);
            });
        });
    });
});
