const create = 'This route creates and return a campaign';
const update = 'This route updates some campaign info';
const getById = 'This route gets an already created campaign by ID';
const getAll = 'This route returns all campaigns';
const updateMatchImages = 'This route updates the match map images';
const updateMatchMusics = 'This route updates the match musics';
const updateMatchDate = `This route updates the match dates\n
------------------------
Params:
- id: expects the campaign id.\n
Query:
- date: "YYYY-MM-DD" format
- operation: "add" | "remove"`;
const publishment = 'This route publish a post in the campaign';
const addCampaignPlayers = 'This route adds player to campaign';
const removeCampaignPlayers = 'This route removes player to campaign';
const inviteEmail = 'This route sends a campaign invitation via email';
const updateCampaignImages = 'This route updates the campaign images';
const banPlayer = 'This route banish a player';
const addPlayerCharacter = 'In this route you can send a character of a player to be added to campaign';
const removePlayerCharacter = 'In this route you can remove a character of a player from a campaign';

export default {
    create,
    update,
    getById,
    getAll,
    updateMatchImages,
    updateMatchMusics,
    updateMatchDate,
    publishment,
    addCampaignPlayers,
    removeCampaignPlayers,
    inviteEmail,
    updateCampaignImages,
    banPlayer,
    addPlayerCharacter,
    removePlayerCharacter,
};
