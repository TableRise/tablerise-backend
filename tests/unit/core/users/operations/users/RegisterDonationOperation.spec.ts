import sinon from 'sinon';
import RegisterDonationOperation from 'src/core/users/operations/users/RegisterDonationOperation';

describe('Core :: Users :: Operations :: RegisterDonationOperation', () => {
    it('should delegate the payload to the service', async () => {
        const registerDonationService = {
            register: sinon.spy(() => ({})),
        };

        const registerDonationOperation = new RegisterDonationOperation({
            registerDonationService,
            logger: (): void => {},
        } as any);

        const payload = {
            userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            validation: false,
            payload: {
                value: 15,
                timestamp: '2026-06-03T12:30:00.000Z',
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            },
        };

        await registerDonationOperation.execute(payload);

        expect(registerDonationService.register).to.have.been.calledWith(payload);
    });
});
