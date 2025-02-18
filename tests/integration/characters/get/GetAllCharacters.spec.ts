import sinon from 'sinon';
import requester from 'tests/support/requester';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { InjectNewCharacter, InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import DatabaseManagement from '@tablerise/database-management';
import CharacterDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import UserDomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';

describe('When recover all characters', () => {
    let characters: CharacterInstance[], 
    modelCharacter: any,
    modelUser: any,
    modelUserDetails: any,
    user: any,
    userDetails: any;

    context('And is succesfull', () => {
        before(async () => {
            modelCharacter = new DatabaseManagement().modelInstance(
                'characterDnd',
                'CharactersDnd'
            );
 
            await modelCharacter.erase();
            characters = CharacterDomainDataFaker.generateCharactersJSON({ count: 2 });
            characters.forEach(async (character) => {
                await InjectNewCharacter(character);
            });
            modelUser = new DatabaseManagement().modelInstance('user',
                'Users');
            modelUserDetails = new DatabaseManagement().modelInstance('user',
                'UserDetails');   

            user = UserDomainDataFaker.generateUsersJSON()[0];
            userDetails = UserDomainDataFaker.generateUserDetailsJSON()[0];
            
            userDetails.role = 'admin';    

            user.inProgress = {
                status: InProgressStatusEnum.enum.DONE,
                currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                code: '',
            };

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);

        });

        after(async () => {
            sinon.restore();
            await modelCharacter.erase();
        });
        it('should return correct data', async () => {
            const login = {
                email: user.email,
                password: 'TheWorld@122',
            };

            const response = await requester().post('/users/login').send(login);   
            const { userId } = response.body;
            const { body } = await requester()
            .get('/characters')
            .expect(HttpStatusCode.OK);

            const userDb = await modelUser.findOne({userId});
            const { role } = await modelUserDetails.findOne({userId: userDb.userId});
            expect(role).to.be.equal('admin');
            expect(body).to.be.an('array');
            expect(body.length).to.be.equal(characters.length);
            body.forEach((char: CharacterInstance) => {
                expect(char).to.be.not.null();
            });
        });
    });
});
