import desc from 'src/interface/campaigns/presentation/campaigns/RoutesDescription';
import { readdirSync } from 'fs';
const path = 'src/core/campaigns/services';
const filesLength = readdirSync(path).length;

describe('Interface :: Campaigns :: Presentation :: RoutesDescription', () => {
    context('When desc object has all route descriptions', () => {
        it('should has the correct length', () => {

            const descLength = Object.keys(desc).length;
            expect(descLength).to.be.equal(filesLength);
        });
    });
});
