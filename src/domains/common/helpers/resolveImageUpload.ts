import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import { FileObject } from 'src/types/shared/file';

interface ImageStorageUploader {
    upload(image: FileObject): Promise<ImageObject>;
}

export async function resolveImageUpload({
    image,
    imageObject,
    imageStorageClient,
}: {
    image?: FileObject;
    imageObject?: ImageObject;
    imageStorageClient: ImageStorageUploader;
}): Promise<ImageObject | undefined> {
    if (imageObject) {
        return imageObject;
    }

    if (!image) {
        return undefined;
    }

    return imageStorageClient.upload(image);
}

export async function resolveImageUploads({
    images,
    imageObject,
    imageStorageClient,
}: {
    images?: FileObject[];
    imageObject?: ImageObject[];
    imageStorageClient: ImageStorageUploader;
}): Promise<ImageObject[]> {
    if (imageObject) {
        return imageObject;
    }

    if (!images?.length) {
        return [];
    }

    const uploadedImages = [] as ImageObject[];

    for (const image of images) {
        uploadedImages.push(await imageStorageClient.upload(image));
    }

    return uploadedImages;
}
