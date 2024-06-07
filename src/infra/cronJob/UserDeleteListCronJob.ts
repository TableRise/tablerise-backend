import { UserInstance } from "src/domains/users/schemas/usersValidationSchema";
import InfraDependencies from "src/types/modules/infra/InfraDependencies";

export default class UserDeleteListCronJob { 
    private readonly _userList: UserInstance[];
    private readonly _logger;
    private readonly _usersRepository;

    constructor({userList, logger, usersRepository }:InfraDependencies['userDeleteListCronJobContract']) {
        this._userList = userList;
        this._logger = logger;
        this._usersRepository = usersRepository;
    }

    public find(): UserInstance[] {
        const users = this._usersRepository.find();
        
    }

}   