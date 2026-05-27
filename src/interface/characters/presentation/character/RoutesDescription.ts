const create = 'Create a new character for the authenticated user.';
const getById = 'Get a character by its id.';
const getAll = 'List all characters.';
const orgSymbol = 'Upload an organization symbol image for the character.';
const update = 'Update a character main stats and profile information.';
const addEquipment = 'Add an equipment item to the character by equipment id.';
const removeEquipment = 'Remove an equipment item from the character and refund 90% of its value.';
const updateMoney = 'Add or subtract money from one of the character currency types.';
const deleteCharacter = 'Delete a character owned by the authenticated user and remove its linked references.';

const updatePicture = 'Upload or replace the character picture. Accepted formats: PNG, JPG, and JPEG.';

export default {
    create,
    getById,
    getAll,
    update,
    updatePicture,
    orgSymbol,
    addEquipment,
    removeEquipment,
    updateMoney,
    deleteCharacter,
};
