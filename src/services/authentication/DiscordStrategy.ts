import 'dotenv/config';
import Discord from 'passport-discord';
import passport from 'passport';

const DiscordStrategy = Discord.Strategy;
const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } = process.env;

passport.use(
    new DiscordStrategy(
        {
            clientID: (DISCORD_CLIENT_ID as string) || 'default',
            clientSecret: (DISCORD_CLIENT_SECRET as string) || 'secret',
            callbackURL: 'http://localhost:3001/auth/discord/callback',
            passReqToCallback: true,
            scope: ['identify', 'guilds'],
        },
        (request, accessToken, refreshToken, profile, done) => {
            done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user as any);
});
