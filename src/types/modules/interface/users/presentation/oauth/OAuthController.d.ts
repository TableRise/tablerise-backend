import DiscordOperation from 'src/core/users/operations/oauth/DiscordOperation';
import GoogleOperation from 'src/core/users/operations/oauth/GoogleOperation';
import CompleteUserOperation from 'src/core/users/operations/oauth/CompleteUserOperation';
import LoginUserOperation from 'src/core/users/operations/users/LoginUserOperation';

export interface OAuthControllerContract {
    googleOperation: GoogleOperation;
    discordOperation: DiscordOperation;
    completeUserOperation: CompleteUserOperation;
    loginUserOperation: LoginUserOperation;
}
