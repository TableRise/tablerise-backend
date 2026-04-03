import DatabaseManagement from '@tablerise/database-management';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { Race } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';

export async function InjectNewDungeonsAndDragonsRulesRaces(rules: Race): Promise<void> {
    const model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Races');
    await model.create(rules);
}

export async function InjectNewUser(user: User): Promise<void> {
    user.password = user.password !== 'oauth' ? await SecurePasswordHandler.hashPassword(user.password) : user.password;

    user.createdAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();

    const model = new DatabaseManagement().modelInstance('user', 'Users');
    await model.create(user);
}

export async function InjectNewUserDetails(userDetails: UserDetail, userId: string): Promise<void> {
    userDetails.userId = userId;

    const modelUserDetails = new DatabaseManagement().modelInstance('user', 'UserDetails');
    await modelUserDetails.create(userDetails);
}

export async function InjectNewCampaign(campaign: Campaign): Promise<void> {
    campaign.createdAt = new Date().toISOString();
    campaign.updatedAt = new Date().toISOString();

    const modelCampaign = new DatabaseManagement().modelInstance('campaign', 'Campaigns');
    await modelCampaign.create(campaign);
}

export async function InjectNewCharacter(character: CharacterInstance): Promise<void> {
    character.createdAt = new Date().toISOString();
    character.updatedAt = new Date().toISOString();

    const modelCharacter = new DatabaseManagement().modelInstance('characterDnd', 'CharactersDnd');
    await modelCharacter.create(character);
}
