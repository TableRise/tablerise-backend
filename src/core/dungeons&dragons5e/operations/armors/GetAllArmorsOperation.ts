import { GetAllArmorsOperationContract } from "src/types/dungeons&dragons5e/contracts/core/armors/GetAllArmors";

export default class GetAllArmorsOperation {
    private readonly _logger;

    constructor({ logger }: GetAllArmorsOperationContract) {
        this._logger = logger;
    }

    public async execute(): Promise<void> {}
}