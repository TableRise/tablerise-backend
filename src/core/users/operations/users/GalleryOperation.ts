import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { GalleryLookupPayload, UserGalleryItem } from 'src/types/api/users/http/payload';

export default class GalleryOperation {
    private readonly galleryService;
    private readonly logger;

    constructor({ galleryService, logger }: UserCoreDependencies['galleryOperationContract']) {
        this.galleryService = galleryService;
        this.logger = logger;
    }

    public async getAll(userId: string): Promise<UserGalleryItem[]> {
        const callName = `[${this.constructor.name}] - ${this.getAll.name}`;
        this.logger('info', callName);
        return this.galleryService.getAll(userId);
    }

    public async getById(payload: GalleryLookupPayload): Promise<UserGalleryItem> {
        const callName = `[${this.constructor.name}] - ${this.getById.name}`;
        this.logger('info', callName);
        return this.galleryService.getById(payload);
    }

    public async remove(payload: GalleryLookupPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.remove.name}`;
        this.logger('info', callName);
        await this.galleryService.remove(payload);
    }
}
