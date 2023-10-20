import Facebook from 'passport-facebook';
import passport from 'passport';

const FacebookStrategy = Facebook.Strategy;
const { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } = process.env;

passport.use(
    new FacebookStrategy(
        {
            clientID: (FACEBOOK_CLIENT_ID as string) || 'default',
            clientSecret: (FACEBOOK_CLIENT_SECRET as string) || 'secret',
            callbackURL: 'http://localhost:3001/auth/facebook/callback',
            passReqToCallback: true,
            scope: ['email'],
            profileFields: ['id', 'displayName', 'email'],
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
