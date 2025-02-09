import DatabaseManagement from '@tablerise/database-management';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';

export async function InjectNewUser(user: UserInstance): Promise<void> {
    user.password =
        user.password !== 'oauth'
            ? await SecurePasswordHandler.hashPassword(user.password)
            : user.password;

    user.createdAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();

    const model = new DatabaseManagement().modelInstance('user', 'Users');
    await model.create(user);
}

export async function InjectNewUserDetails(
    userDetails: UserDetailInstance,
    userId: string
): Promise<void> {
    userDetails.userId = userId;

    const modelUserDetails = new DatabaseManagement().modelInstance(
        'user',
        'UserDetails'
    );
    await modelUserDetails.create(userDetails);
}

export async function InjectNewCampaign(campaign: CampaignInstance): Promise<void> {
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


