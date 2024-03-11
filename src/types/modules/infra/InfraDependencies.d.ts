import { SocketIOContract } from 'src/types/modules/infra/connection/SocketIO.d';
import { ImageStorageClientContract } from 'src/types/modules/infra/clients/ImageStorageClient';
import { UsersRepositoryContract } from 'src/types/modules/infra/repositories/users/UsersRepository';
import { UsersDetailsRepositoryContract } from 'src/types/modules/infra/repositories/users/UsersDetailsRepository';
import { UpdateTimestampRepositoryContract } from 'src/types/modules/infra/repositories/users/UpdateTimestampRepository';
import { CampaignsRepositoryContract } from './repositories/campaigns/CampaignsRepository';

export default interface InfraDependencies {
    // <--------- USERS DOMAIN --------->
    imageStorageClientContract: ImageStorageClientContract;
    usersRepositoryContract: UsersRepositoryContract;
    usersDetailsRepositoryContract: UsersDetailsRepositoryContract;
    updateTimestampRepositoryContract: UpdateTimestampRepositoryContract;

    // <--------- CAMPAIGN DOMAIN --------->
    socketIOContract: SocketIOContract;
    campaignsRepositoryContract: CampaignsRepositoryContract;
}
