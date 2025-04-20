const create = `
In this route you can create a new character for an user,
this character won't be associated to any campaign or match,
this association must be done whit other routes available in this API
`;
const getById = 'This route gets an already created character by ID';
const getAll = 'This route returns all characters';
const getByCampaign = 'Recover characters from campaign';
const orgSymbol = 'Upload a Organization picture';
const update = 'Update character stats and infos';

export default {
    create,
    getById,
    getAll,
    update,
    getByCampaign,
    orgSymbol,
};
