const create = 'This route creates and return a campaign';
const update = 'This route updates some campaign info';
const getById = 'This route gets an already created campaign by ID';
const getAll = 'This route returns all campaigns';
const updateMatchImages = 'This route updates the match map images';
const updateMatchMusics = 'This route updates the match musics';
const updateMatchDates = `This route updates the match dates\n
------------------------
Params:
- id: expects the match id.\n
Query:
- date: "YYYY-MM-DD" format
- operation: "add" | "remove"`;
const updateMatchPlayers = 'This route updates the match players';

export default {
    create,
    update,
    getById,
    getAll,
    updateMatchImages,
    updateMatchMusics,
    updateMatchDates,
    updateMatchPlayers,
};
