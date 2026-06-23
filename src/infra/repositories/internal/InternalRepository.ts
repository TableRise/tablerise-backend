import InfraDependencies from 'src/types/modules/infra/InfraDependencies';

type ImageForDeletion =
    | {
          deleteUrl?: string | null;
          delete_url?: string | null;
      }
    | null
    | undefined;

export default class InternalRepository {
    public readonly imagesForDeletion: string[];
    private readonly logger;

    constructor({ logger }: InfraDependencies['internalRepositoryContract']) {
        this.logger = logger;
        this.imagesForDeletion = [];

        this.addImageForDeletion = this.addImageForDeletion.bind(this);
    }

    public addImageForDeletion(image?: ImageForDeletion): void {
        const callName = `[${this.constructor.name}] - ${this.addImageForDeletion.name}`;
        this.logger('info', callName);

        const deleteUrl = image?.deleteUrl ?? image?.delete_url;
        if (!deleteUrl) return;

        this.imagesForDeletion.push(deleteUrl);
    }
}
