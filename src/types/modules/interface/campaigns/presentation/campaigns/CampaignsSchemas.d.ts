import { ISchemaProps } from 'src/types/shared/configs';

export interface ICampaignsSchemas {
    postCreateCampaign: ISchemaProps;
    putUpdateCampaign: ISchemaProps;
    postAddCampaignPlayers: ISchemaProps;
    postBanCampaignPlayer: ISchemaProps;
    postInvitePlayerByEmail: ISchemaProps;
    postCreateCampaignPublishment: ISchemaProps;
    patchAddCampaignMatchDate: ISchemaProps;
    patchUpdateCampaignMatchMapImages: ISchemaProps;
    patchAddCampaignMatchMusics: ISchemaProps;
    patchRemoveCampaignMatchMusic: ISchemaProps;
    patchEditCampaignMatchMusic: ISchemaProps;
    patchUpdateCampaignPlayerCharacter: ISchemaProps;
    patchRemoveCampaignPlayerCharacter: ISchemaProps;
    patchUpdateCampaignPlayerLimit: ISchemaProps;
    getAllCampaigns: ISchemaProps;
    postConfirmPlayerPresence: ISchemaProps;
    patchConfirmCampaignPlayer: ISchemaProps;
    patchUpdateCampaignCover: ISchemaProps;
    patchRemoveCampaignMatchMapImage: ISchemaProps;
    patchTransferDungeonMaster: ISchemaProps;
    patchUpdateMatchCharacterPicture: ISchemaProps;
    patchUpdateCampaignJournalHighlight: ISchemaProps;
    patchUpdateCampaignJournalPost: ISchemaProps;
    patchDeleteCampaignJournalPost: ISchemaProps;
}
