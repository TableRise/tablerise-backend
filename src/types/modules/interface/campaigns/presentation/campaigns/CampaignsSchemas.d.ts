import { ISchemaProps } from 'src/types/shared/configs';

export interface ICampaignsSchemas {
    postCreateCampaign: ISchemaProps;
    putUpdateCampaign: ISchemaProps;
    postAddCampaignPlayers: ISchemaProps;
    postRemoveCampaignPlayers: ISchemaProps;
    postCreateCampaignPublishment: ISchemaProps;
    postCampaignBuy: ISchemaProps;
    patchUpdateCampaignMatchMapImages: ISchemaProps;
    patchUpdateCampaignMatchImages: ISchemaProps;
    patchHighlightCampaignMatchImage: ISchemaProps;
    patchAddCampaignMatchMusics: ISchemaProps;
    patchRemoveCampaignMatchMusic: ISchemaProps;
    patchEditCampaignMatchMusic: ISchemaProps;
    patchUpdateCampaignPlayerCharacter: ISchemaProps;
    patchRemoveCampaignPlayerCharacter: ISchemaProps;
    getAllCampaigns: ISchemaProps;
    postConfirmPlayerPresence: ISchemaProps;
    patchConfirmCampaignPlayer: ISchemaProps;
    patchUpdateCampaignCover: ISchemaProps;
    patchRemoveCampaignMatchMapImage: ISchemaProps;
    patchTransferDungeonMaster: ISchemaProps;
    patchUpdateCampaignJournalHighlight: ISchemaProps;
    patchUpdateCampaignJournalPost: ISchemaProps;
    patchDeleteCampaignJournalPost: ISchemaProps;
    patchUpdateCampaignPlayerNote: ISchemaProps;
    patchRemoveCampaignPlayerNote: ISchemaProps;
}
