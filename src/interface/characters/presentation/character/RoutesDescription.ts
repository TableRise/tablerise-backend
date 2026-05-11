const create = `
In this route you can create a new character for an user,
this character won't be associated to any campaign or match,
this association must be done whit other routes available in this API
`;
const getById = 'This route gets an already created character by ID';
const getAll = 'This route returns all characters';
const orgSymbol = 'Upload a Organization picture';
const update = 'Update character stats and infos';
const addEquipment = 'Add an equipment to character by equipment ID';
const removeEquipment = 'Remove an equipment from character and refund 90% of its value';

const updatePicture = `
This route can be used to upload a picture for your character, must be
in one of these formats: [png, jpg, jpeg]
`;

export default {
    create,
    getById,
    getAll,
    update,
    updatePicture,
    orgSymbol,
    addEquipment,
    removeEquipment,
};
