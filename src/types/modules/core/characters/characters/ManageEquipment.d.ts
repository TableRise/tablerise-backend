import AddEquipmentService from 'src/core/characters/services/AddEquipmentService';
import RemoveEquipmentService from 'src/core/characters/services/RemoveEquipmentService';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface AddEquipmentOperationContract {
    addEquipmentService: AddEquipmentService;
    logger: Logger;
}

export interface AddEquipmentServiceContract {
    charactersRepository: CharactersRepository;
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}

export interface RemoveEquipmentOperationContract {
    removeEquipmentService: RemoveEquipmentService;
    logger: Logger;
}

export interface RemoveEquipmentServiceContract {
    charactersRepository: CharactersRepository;
    logger: Logger;
}
