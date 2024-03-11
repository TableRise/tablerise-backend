import { z } from 'zod';

const imageObjectZodSchema = z.object({
    id: z.string(),
    link: z.string(),
    uploadDate: z.string(),
});

const mainStoryZodSchema = z.object({
    title: z.string(),
    lore: z.string(),
    image: imageObjectZodSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});

const environmentZodSchema = z.object({
    title: z.string(),
    lore: z.string(),
    environmentImage: imageObjectZodSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});

const characterZodSchema = z.object({
    characterId: z.string(),
    lore: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

const loresZodSchema = z.object({
    playerCharacters: z.array(characterZodSchema),
    dungeonMasterCharacters: z.array(characterZodSchema),
    environments: z.array(environmentZodSchema),
    mainHistory: z.array(mainStoryZodSchema),
});

const announcementZodSchema = z.object({
    title: z.string(),
    author: z.string(),
    content: z.string(),
});

const infosZodSchema = z.object({
    campaignAge: z.string(),
    matchDates: z.array(z.string()),
    announcements: z.array(announcementZodSchema),
    visibility: z.string(),
});

const logZodSchema = z.object({
    loggedAt: z.string(),
    content: z.string(),
});

const musicZodSchema = z.object({
    title: z.string(),
    youtubeLink: z.string(),
});

const sizeZodSchema = z.object({
    width: z.number(),
    height: z.number(),
});

const positionZodSchema = z.object({
    x: z.number(),
    y: z.number(),
});

const avatarZodSchema = z.object({
    avatarId: z.string(),
    userId: z.string(),
    picture: imageObjectZodSchema,
    position: positionZodSchema,
    size: sizeZodSchema,
    status: z.string(),
});

const matchDataZodSchema = z.object({
    matchId: z.string(),
    avatars: z.array(avatarZodSchema),
    music: z.array(musicZodSchema),
    mapImages: z.array(imageObjectZodSchema),
    logs: z.array(logZodSchema),
});

const playerZodSchema = z.object({
    userId: z.string(),
    characterIds: z.array(z.string()),
    role: z.string(),
});

const campaignsZodSchema = z.object({
    title: z.string(),
    cover: imageObjectZodSchema,
    description: z.string(),
    campaignPlayers: z.array(playerZodSchema),
    matchData: matchDataZodSchema,
    infos: infosZodSchema,
    lores: loresZodSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const createCampaignsZodSchema = z.object({
    title: z.string(),
});

export type CampaignPayload = z.infer<typeof createCampaignsZodSchema>;
export type CampaignInstance = z.infer<typeof campaignsZodSchema> & {
    campaignId: string;
};
// export type CampaignInstance = z.infer<typeof campaignsZodSchema> & {
//     campaignId: string;
//     title: string;
//     cover: {
//         id: string;
//         link: string;
//         uploadDate: string;
//     };
//     description: string;
//     campaignPlayers: Array<{
//         userId: string;
//         characterIds: string[];
//         role: string;
//     }>;
//     matchData: {
//         matchId: string;
//         avatars: Array<{
//             avatarId: string;
//             userId: string;
//             picture: {
//                 id: string;
//                 link: string;
//                 uploadDate: string;
//             };
//             position: {
//                 x: number;
//                 y: number;
//             };
//             size: {
//                 width: number;
//                 height: number;
//             };
//             status: string;
//         }>;
//         music: Array<{
//             title: string;
//             youtubeLink: string;
//         }>;
//         mapImages: Array<{
//             id: string;
//             link: string;
//             uploadDate: string;
//         }>;
//         logs: Array<{
//             loggedAt: string;
//             content: string;
//         }>;
//     };
//     infos: {
//         campaignAge: string;
//         matchDates: string[];
//         announcements: Array<{
//             title: string;
//             author: string;
//             content: string;
//         }>;
//         visibility: string;
//     };
//     lores: {
//         playerCharacters: Array<{
//             characterId: string;
//             lore: string;
//             createdAt: string;
//             updatedAt: string;
//         }>;
//         dungeonMasterCharacters: Array<{
//             characterId: string;
//             lore: string;
//             createdAt: string;
//             updatedAt: string;
//         }>;
//         environments: Array<{
//             title: string;
//             lore: string;
//             environmentImage: {
//                 id: string;
//                 link: string;
//                 uploadDate: string;
//             };
//             createdAt: string;
//             updatedAt: string;
//         }>;
//         mainHistory: Array<{
//             title: string;
//             lore: string;
//             image: { id: string; link: string; uploadDate: string };
//             createdAt: string;
//             updatedAt: string;
//         }>;
//     };
//     createdAt: string;
//     updatedAt: string;
// };

export default campaignsZodSchema;
