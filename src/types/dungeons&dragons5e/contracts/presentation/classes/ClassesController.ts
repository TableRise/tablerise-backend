import GetAllClassesOperation from 'src/core/dungeons&dragons5e/operations/classes/GetAllClassesOperation';
import GetClassOperation from 'src/core/dungeons&dragons5e/operations/classes/GetClassOperation';
import GetDisabledClassesOperation from 'src/core/dungeons&dragons5e/operations/classes/GetDisabledClassesOperation';
import ToggleClassesAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/classes/ToggleClassesAvailabilityOperation';

export interface ClassesControllerContract {
    getAllClassesOperation: GetAllClassesOperation;
    getClassOperation: GetClassOperation;
    getDisabledClassesOperation: GetDisabledClassesOperation;
    toggleClassesAvailabilityOperation: ToggleClassesAvailabilityOperation;
}
