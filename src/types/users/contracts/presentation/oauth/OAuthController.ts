import DiscordOperation from 'src/core/users/operations/oauth/DiscordOperation';
import FacebookOperation from 'src/core/users/operations/oauth/FacebookOperation';
import GoogleOperation from 'src/core/users/operations/oauth/GoogleOperation';
import CompleteUserOperation from 'src/core/users/operations/oauth/CompleteUserOperation';

export interface OAuthControllerContract {
    googleOperation: GoogleOperation;
    facebookOperation: FacebookOperation;
    discordOperation: DiscordOperation;
    completeUserOperation: CompleteUserOperation;
}
