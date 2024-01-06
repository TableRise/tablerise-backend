export interface FileObject {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: any;
    size: number;
    description?: string;
}
