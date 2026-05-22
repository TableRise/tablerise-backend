import User from '@tablerise/database-management/dist/src/interfaces/User';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateEmailPayload } from 'src/types/api/users/http/payload';
import { UserEmail } from 'src/types/modules/core/users/users/UpdateEmail';

export default class UpdateEmailService {
    private readonly usersRepository;
    private readonly stateMachine;
    private readonly logger;

    constructor({ usersRepository, stateMachine, logger }: UserCoreDependencies['updateEmailServiceContract']) {
        this.usersRepository = usersRepository;
        this.stateMachine = stateMachine;
        this.logger = logger;

        this.update = this.update.bind(this);
    }

    private changeEmail({ user, email }: UserEmail): User {
        const callName = `[${this.constructor.name}] - ${this.changeEmail.name}`;
        this.logger('info', callName);
        user.email = email;
        return user;
    }

    public async update({ userId, email }: UpdateEmailPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.update.name}`;
        this.logger('info', callName);
        const { status, flows } = this.stateMachine.props;

        const userInDb = await this.usersRepository.findOne({ userId });

        const emailAlreadyExist = await this.usersRepository.find({ email });

        if (userInDb.inProgress.status !== status.WAIT_TO_FINISH_EMAIL_CHANGE)
            HttpRequestErrors.throwError('invalid-user-status');
        if (emailAlreadyExist.length) HttpRequestErrors.throwError('email-already-exist');

        const userWithEmailChanged = this.changeEmail({ user: userInDb, email });

        await this.stateMachine.machine(flows.UPDATE_EMAIL, userWithEmailChanged);

        await this.usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userWithEmailChanged,
        });
    }
}
