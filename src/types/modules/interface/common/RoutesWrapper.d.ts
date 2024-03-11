import CampaignsRoutesBuilder from 'src/interface/campaigns/CampaignsRoutesBuilder';
import DungeonsAndDragonsRoutesBuilder from 'src/interface/dungeons&dragons5e/DungeonsAndDragonsRoutesBuilder';
import UsersRoutesBuilder from 'src/interface/users/UsersRoutesBuilder';
import CampaignsRoutesBuilder from 'src/interface/campaigns/CampaignsRoutesBuilder';

export interface RoutesWrapperContract {
    dungeonsAndDragonsRoutesBuilder: DungeonsAndDragonsRoutesBuilder;
    usersRoutesBuilder: UsersRoutesBuilder;
    campaignsRoutesBuilder: CampaignsRoutesBuilder;
}
