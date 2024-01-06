import GetAllRacesOperation from 'src/core/dungeons&dragons5e/operations/races/GetAllRacesOperation';
import GetDisabledRacesOperation from 'src/core/dungeons&dragons5e/operations/races/GetDisabledRacesOperation';
import GetRaceOperation from 'src/core/dungeons&dragons5e/operations/races/GetRaceOperation';
import ToggleRacesAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/races/ToggleRacesAvailabilityOperation';

export interface RacesControllerContract {
    getAllRacesOperation: GetAllRacesOperation;
    getRaceOperation: GetRaceOperation;
    getDisabledRacesOperation: GetDisabledRacesOperation;
    toggleRacesAvailabilityOperation: ToggleRacesAvailabilityOperation;
}
