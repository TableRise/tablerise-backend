import newUUID from 'src/domains/common/helpers/newUUID';
import { ImageJSONPayload } from 'src/types/modules/infra/datafakers/campaigns/DomainDataFaker';
import dataGenerator from '../dataGenerator';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';

function createImageFaker({
    id = newUUID(),
}: ImageObject): ImageObject {
    dataGenerator.cover.id = id;  
    return dataGenerator.cover;
}

export default function generateImagesFaker({
    count,
    id,
}: ImageJSONPayload): ImageObject[] {
    const images: ImageObject[] = [];

    for (let index = 0; index <= count; index += 1) {
        images.push(createImageFaker({ id } as ImageObject));
    }

    return images;
}
