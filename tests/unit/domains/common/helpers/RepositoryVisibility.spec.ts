import {
    getCharacterAuthorUserId,
    getCharacterCampaignId,
    isClosedCampaign,
    isUserWaitingToDelete,
} from 'src/domains/common/helpers/RepositoryVisibility';

describe('Domains :: Common :: Helpers :: RepositoryVisibility', () => {
    it('should detect closed campaigns only when the status matches', () => {
        expect(isClosedCampaign({ status: 'closed' } as any)).to.equal(true);
        expect(isClosedCampaign({ status: 'active' } as any)).to.equal(false);
        expect(isClosedCampaign(null)).to.equal(false);
    });

    it('should detect users waiting to be deleted only when the status matches', () => {
        expect(isUserWaitingToDelete({ inProgress: { status: 'wait-to-delete-user' } } as any)).to.equal(true);
        expect(isUserWaitingToDelete({ inProgress: { status: 'done' } } as any)).to.equal(false);
        expect(isUserWaitingToDelete(undefined)).to.equal(false);
    });

    it('should extract character campaign ids and author ids only when they are non-empty strings', () => {
        expect(getCharacterCampaignId({ campaignId: 'campaign-1' } as any)).to.equal('campaign-1');
        expect(getCharacterCampaignId({ campaignId: '' } as any)).to.equal(null);
        expect(getCharacterCampaignId(null)).to.equal(null);

        expect(getCharacterAuthorUserId({ author: { userId: 'user-1' } } as any)).to.equal('user-1');
        expect(getCharacterAuthorUserId({ author: { userId: '' } } as any)).to.equal(null);
        expect(getCharacterAuthorUserId(undefined)).to.equal(null);
    });
});
