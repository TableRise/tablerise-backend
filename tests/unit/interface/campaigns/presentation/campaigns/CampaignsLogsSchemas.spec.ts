import CampaignsSchemas from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';

describe('Interface :: Campaigns :: Presentation :: Campaigns :: CampaignsLogsSchemas', () => {
    it('should validate the post campaign log body', () => {
        const schemas = CampaignsSchemas();

        expect(() =>
            schemas.postCampaignLog.body.parse({
                loggedAt: '2026-05-13T12:00:00.000Z',
                content: 'A new log entry',
            })
        ).to.not.throw();

        expect(() =>
            schemas.postCampaignLog.body.parse({
                loggedAt: '2026-05-13T12:00:00.000Z',
            })
        ).to.throw();
    });
});
