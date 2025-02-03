import DomainDataFakerCampaign from './campaigns/DomainDataFaker';
import DomainDataFakerCharacter from './characters/DomainDataFaker';
import DomainDataFakerDD from './dungeons&dragons5e/DomainDataFaker';
import DomainDataFakerUser from './users/DomainDataFaker';

const Datafakers = {
    users: DomainDataFakerUser,
    dungeonsAndDragons: DomainDataFakerDD,
    campaign: DomainDataFakerCampaign,
    character: DomainDataFakerCharacter
}

export default Datafakers;
