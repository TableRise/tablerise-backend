import User from '@tablerise/database-management/dist/src/interfaces/User';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdatePasswordPayload } from 'src/types/api/users/http/payload';
import { UserPassword } from 'src/types/modules/core/users/users/UpdatePassword';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default class UpdatePasswordService {
    private readonly usersRepository;
    private readonly stateMachine;
    private readonly logger;

    constructor({ usersRepository, stateMachine, logger }: UserCoreDependencies['updatePasswordServiceContract']) {
        this.usersRepository = usersRepository;
        this.stateMachine = stateMachine;
        this.logger = logger;
    }

    private async changePassword({ user, password }: UserPassword): Promise<User> {
        const callName = `[${this.constructor.name}] - ${this.changePassword.name}`;
        this.logger('info', callName);
        const { flows } = this.stateMachine.props;

        user.password = await SecurePasswordHandler.hashPassword(password);

        return this.stateMachine.machine(flows.UPDATE_PASSWORD, user);
    }

    public async update({ email, password }: UpdatePasswordPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.update.name}`;
        this.logger('info', callName);
        const { status } = this.stateMachine.props;

        const userInDb = await this.usersRepository.findOne({ email });
        if (!userInDb) HttpRequestErrors.throwError('user-inexistent');

        if (userInDb.inProgress.status !== status.WAIT_TO_FINISH_PASSWORD_CHANGE)
            HttpRequestErrors.throwError('invalid-user-status');

        const passwordChanged = await this.changePassword({ user: userInDb, password });

        await this.usersRepository.update({
            query: { userId: userInDb.userId },
            payload: passwordChanged,
        });
    }
}
