import { ISchemaProps } from 'src/types/shared/configs';

export interface ICampaignsSchemas {
    postCreateCampaign: ISchemaProps;
    putUpdateCampaign: ISchemaProps;
    postAddCampaignPlayers: ISchemaProps;
    postBanCampaignPlayer: ISchemaProps;
    postInvitePlayerByEmail: ISchemaProps;
    postCreateCampaignPublishment: ISchemaProps;
    patchUpdateCampaignMatchDate: ISchemaProps;
    patchUpdateCampaignMatchMapImages: ISchemaProps;
    patchUpdateCampaignMatchMusics: ISchemaProps;
    patchUpdateCampaignPlayerCharacter: ISchemaProps;
    patchRemoveCampaignPlayerCharacter: ISchemaProps;
    patchUpdateCampaignImages: ISchemaProps;
    patchUpdateCampaignPlayerLimit: ISchemaProps;
    getAllCampaigns: ISchemaProps;
    postConfirmPlayerPresence: ISchemaProps;
}
