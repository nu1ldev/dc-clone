import { Client, Account, Databases, OAuthProvider } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67c9a38f002b19625052');

const mainDb = new Databases(client);
const account = new Account(client);

export { ID } from 'appwrite';

export {
    account,
    mainDb as db,
    OAuthProvider
}