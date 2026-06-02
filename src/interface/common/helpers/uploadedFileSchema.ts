import { z } from 'zod';

const isBrowserFile = (value: unknown): value is File => typeof File !== 'undefined' && value instanceof File;

const isMulterFile = (value: unknown): value is Express.Multer.File => {
    if (!value || typeof value !== 'object') return false;

    return 'fieldname' in value && 'originalname' in value && 'mimetype' in value && 'buffer' in value;
};

const uploadedFileSchema = z.custom<File | Express.Multer.File>(
    (value) => isBrowserFile(value) || isMulterFile(value),
    { message: 'Invalid file upload' }
);

export default uploadedFileSchema;
