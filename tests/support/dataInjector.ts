import DatabaseManagement from '@tablerise/database-management';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { Race } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';

export async function InjectNewDungeonsAndDragonsRulesRaces(rules: Race): Promise<void> {
    const model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Races');
    await model.create(rules);
}

export async function InjectNewDungeonsAndDragonsArmors(data: any): Promise<void> {
    const model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Armors');
    await model.create(data);
}

export async function InjectNewDungeonsAndDragonsBackgrounds(data: any): Promise<void> {
    const model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Backgrounds');
    await model.create(data);
}

export async function InjectNewDungeonsAndDragonsClasses(data: any): Promise<void> {
    const model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Classes');
    await model.create(data);
}

export async function InjectNewDungeonsAndDragonsFeats(data: any): Promise<void> {
    const model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Feats');
    await model.create(data);
}

export async function InjectNewDungeonsAndDragonsGods(data: any): Promise<void> {
    const model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Gods');
    await model.create(data);
}

export async function InjectNewDungeonsAndDragonsItems(data: any): Promise<void> {
    const model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Items');
    await model.create(data);
}

export async function InjectNewDungeonsAndDragonsMagicItems(data: any): Promise<void> {
    const model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'MagicItems');
    await model.create(data);
}

export async function InjectNewDungeonsAndDragonsMonsters(data: any): Promise<void> {
    const model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Monsters');
    await model.create(data);
}

export async function InjectNewDungeonsAndDragonsRealms(data: any): Promise<void> {
    const model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Realms');
    await model.create(data);
}

export async function InjectNewDungeonsAndDragonsSpells(data: any): Promise<void> {
    const model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Spells');
    await model.create(data);
}

export async function InjectNewDungeonsAndDragonsWeapons(data: any): Promise<void> {
    const model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Weapons');
    await model.create(data);
}

export async function InjectNewDungeonsAndDragonsWikis(data: any): Promise<void> {
    const model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Wikis');
    await model.create(data);
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

export async function InjectNewCharacter(character: CharactersDnd): Promise<void> {
    character.createdAt = new Date().toISOString();
    character.updatedAt = new Date().toISOString();

    const modelCharacter = new DatabaseManagement().modelInstance('characterDnd', 'CharactersDnd');
    await modelCharacter.create(character);
}
