import CampaignsRoutesBuilder from 'src/interface/campaigns/CampaignsRoutesBuilder';
import CharactersRoutesBuilder from 'src/interface/characters/CharactersRoutesBuilder';
import DungeonsAndDragonsRoutesBuilder from 'src/interface/dungeons&dragons5e/DungeonsAndDragonsRoutesBuilder';
import UsersRoutesBuilder from 'src/interface/users/UsersRoutesBuilder';

export interface RoutesWrapperContract {
    dungeonsAndDragonsRoutesBuilder: DungeonsAndDragonsRoutesBuilder;
    usersRoutesBuilder: UsersRoutesBuilder;
    campaignsRoutesBuilder: CampaignsRoutesBuilder;
    charactersRoutesBuilder: CharactersRoutesBuilder;
}
