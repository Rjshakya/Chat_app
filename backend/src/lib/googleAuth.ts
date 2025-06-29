import { Credentials, LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library";
import { google } from "googleapis";

const clientId = process.env.GG_CLIENT_ID;
const clientSecret = process.env.GG_CLIENT_SECRET;
const redirectUri = process.env.GG_REDIRECT_URI;

const googleOauthClient = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri,
});

export const getUserInfo = async (
  Oauth2Client: OAuth2Client,
  tokens: Credentials
) => {
  try {
    const ticket = await Oauth2Client.verifyIdToken({
      idToken: tokens.id_token || "",
      audience: clientId,
    });

    const { email, email_verified, name, picture }:TokenPayload = ticket.getPayload()!

    return{
      email,
      email_verified,
      name,
      picture
    }

  } catch (error) {
    console.log(error);
    throw new Error("failed in getting user info");
  }
};

export default googleOauthClient;
