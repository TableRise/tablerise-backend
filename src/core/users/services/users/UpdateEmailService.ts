import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateEmailPayload } from 'src/types/api/users/http/payload';
import { UserEmail } from 'src/types/modules/core/users/users/UpdateEmail';
import StateMachine from 'src/domains/common/StateMachine';

export default class UpdateEmailService {
    private readonly _usersRepository;
    private readonly _stateMachineProps;
    private readonly _logger;

    constructor({
        usersRepository,
        stateMachineProps,
        logger,
    }: UserCoreDependencies['updateEmailServiceContract']) {
        this._usersRepository = usersRepository;
        this._stateMachineProps = stateMachineProps;
        this._logger = logger;

        this.update = this.update.bind(this);
    }

    private _changeEmail({ user, email }: UserEmail): UserInstance {
        this._logger('info', 'ChangeEmail - UpdateEmailService');
        user.email = email;
        return user;
    }

    public async update({ userId, email }: UpdateEmailPayload): Promise<void> {
        this._logger('info', 'Update - UpdateEmailService');
        const { status, flows } = this._stateMachineProps;

        const userInDb = await this._usersRepository.findOne({ userId });

        const emailAlreadyExist = await this._usersRepository.find({ email });

        if (userInDb.inProgress.status !== status.WAIT_TO_FINISH_EMAIL_CHANGE)
            HttpRequestErrors.throwError('invalid-user-status');
        if (emailAlreadyExist.length) HttpRequestErrors.throwError('email-already-exist');

        const emailChanged = this._changeEmail({ user: userInDb, email });

        emailChanged.inProgress.status = StateMachine(
            flows.UPDATE_EMAIL,
            status.WAIT_TO_FINISH_EMAIL_CHANGE
        );

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: emailChanged,
        });
    }
}
