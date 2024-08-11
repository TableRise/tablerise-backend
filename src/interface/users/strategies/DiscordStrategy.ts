import passport from 'passport';
import Discord from 'passport-discord';

const DiscordStrategy = Discord.Strategy;
const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } = process.env;

passport.use(
    new DiscordStrategy(
        {
            clientID: (DISCORD_CLIENT_ID as string) || 'default',
            clientSecret: (DISCORD_CLIENT_SECRET as string) || 'secret',
            scope: ['identify', 'email', 'guilds', 'guilds.join'],
            callbackURL: `${process.env.SWAGGER_URL as string}/oauth/discord/callback`,
            passReqToCallback: true,
        },
        (request, accessToken, refreshToken, profile, done) => {
            done(null, profile as unknown as Express.User);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user as any);
});
