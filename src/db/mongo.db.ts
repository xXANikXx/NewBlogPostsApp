import {Collection, Db, MongoClient} from "mongodb";
import {SETTINGS} from "../core/settings/settings";
import {Blog} from "../blogs/domain/blog";
import {Post} from "../posts/domain/post";
import {User} from "../users/domain/user";
import {Comment} from "../comments/domain/comment";
import {SessionDto} from "../auth/authorization/types/session";
import {RequestLogDto} from "../auth/authorization/rateLimit/types/request_log.dto";

const BLOG_COLLECTION_NAME = 'blogs';
const POST_COLLECTION_NAME = 'posts';
const USERS_COLLECTION_NAME = 'users';
const COMMENT_COLLECTION_NAME = 'comments';
const SESSION_COLLECTION_NAME = 'sessions';
const RATE_LIMIT_COLLECTION_NAME = 'rateLimit';

export let client: MongoClient;
export let sessionCollection: Collection<SessionDto>
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;
export let commentCollection: Collection<Comment>;
export let rateLimitCollection: Collection<RequestLogDto>

export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db(SETTINGS.DB_NAME);

    sessionCollection = db.collection<SessionDto>(SESSION_COLLECTION_NAME);
    blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
    postCollection = db.collection<Post>(POST_COLLECTION_NAME);
    userCollection = db.collection<User>(USERS_COLLECTION_NAME);
    commentCollection = db.collection<Comment>(COMMENT_COLLECTION_NAME);
    rateLimitCollection = db.collection<RequestLogDto>(RATE_LIMIT_COLLECTION_NAME)

    await sessionCollection.createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0 }
    );

    await rateLimitCollection.createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: 10 }
    );

    try {
        await client.connect();
        await db.command({ ping: 1 });
        console.log('✅ Connected to the database');
    } catch (e) {
        await client.close();
        throw new Error(`❌ Database not connected: ${e}`);
    }
}

export async function stopDb() {
    if (!client) {
        throw new Error(`❌ No active client`);
    }
    await client.close();
}