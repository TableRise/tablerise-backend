const create = 'This route creates and return a campaign';
const update = 'This route updates some campaign info';
const getById = 'This route gets an already created campaign by ID';
const getAll = 'This route returns all campaigns';
const addMatchImages = 'This route adds map images to the active match';
const removeMatchImage = 'This route removes one map image from the active match';
const addMatchMusic = 'This route adds a music to the active match';
const removeMatchMusic = 'This route removes a music from the active match';
const editMatchMusic = 'This route edits a music from the active match';
const addMatchDate = `This route adds the next match date\n
------------------------
Params:
- id: expects the campaign id.\n
Query:
- date: "YYYY-MM-DD" format`;
const removeMatchDate = 'This route removes the next match date';
const publishment = 'This route publish a post in the campaign';
const addCampaignPlayers = 'This route adds player to campaign';
const removeCampaignPlayers = 'This route removes player to campaign';
const inviteEmail = 'This route sends a campaign invitation via email';
const banPlayer = 'This route banish a player';
const addPlayerCharacter = 'In this route you can send a character of a player to be added to campaign';
const removePlayerCharacter = 'In this route you can remove a character of a player from a campaign';
const getCampaignCharacters = 'This route returns all characters belonging to a campaign';
const getCampaignPlayers = 'This route returns all players belonging to a campaign';
const getCampaignJournalPosts = 'This route returns all journal posts belonging to a campaign';
const getCampaignJournalHighlight = 'This route returns the highlighted journal post belonging to a campaign';
const getCharactersByPlayer = 'This route returns all characters of the authenticated player in a campaign';
const confirmCampaignPlayer =
    'This route confirms a pending player in the campaign, allowed only for dungeon_master or admin_player';
const updateCampaignCover = 'This route updates the cover image of a campaign';
const removeCampaignCover = 'This route removes the cover image of a campaign';
const transferDungeonMaster =
    'This route transfers the dungeon_master role to another player, only the current dungeon_master can perform this action';
const updateMatchCharacterPicture =
    'This route uploads and sets the picture (token) for a character in an active match';
const updateCampaignJournalHighlight =
    'This route updates the highlighted journal post, allowed only for dungeon_master or admin_player';
const updateCampaignJournalPost = 'This route updates a journal post and is allowed only for the player author';
const deleteCampaignJournalPost =
    'This route deletes a journal post and is allowed for dungeon_master, admin_player or the player author';

export default {
    create,
    update,
    getById,
    getAll,
    addMatchImages,
    removeMatchImage,
    addMatchMusic,
    removeMatchMusic,
    editMatchMusic,
    addMatchDate,
    removeMatchDate,
    publishment,
    addCampaignPlayers,
    removeCampaignPlayers,
    inviteEmail,
    banPlayer,
    addPlayerCharacter,
    removePlayerCharacter,
    getCampaignCharacters,
    getCampaignPlayers,
    getCampaignJournalPosts,
    getCampaignJournalHighlight,
    getCharactersByPlayer,
    confirmCampaignPlayer,
    updateCampaignCover,
    removeCampaignCover,
    transferDungeonMaster,
    updateMatchCharacterPicture,
    updateCampaignJournalHighlight,
    updateCampaignJournalPost,
    deleteCampaignJournalPost,
};
