import 'dotenv/config';
import Google from 'passport-google-oauth20';
import passport from 'passport';

const GoogleStrategy = Google.Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

passport.use(
    new GoogleStrategy(
        {
            clientID: (GOOGLE_CLIENT_ID as string) || '',
            clientSecret: (GOOGLE_CLIENT_SECRET as string) || '',
            callbackURL: 'http://localhost:3001/auth/google/callback',
            passReqToCallback: true,
            scope: ['profile', 'email'],
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
