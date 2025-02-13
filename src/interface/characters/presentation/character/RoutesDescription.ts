const create = `
In this route you can create a new character for an user,
this character won't be associated to any campaign or match,
this association must be done whit other routes available in this API
`;

const getByCampaign = 'Recover characters from campaign';

const updatePicture = `
This route can be used to upload a picture for your character, must be
in one of these formats: [png, jpg, jpeg]
`;

export default {
    create,
    getByCampaign,
    updatePicture,
};
