import {rateLimitCollection} from "../../../../db/mongo.db";


const LIMIT_WINDOW_SEC = 10;
const LIMIT_COUNT = 5;

export class RequestLogRepository {
    async increment(IP: string, URL: string): Promise<number> {
        const now = new Date();
        const cutoff = new Date(Date.now() - LIMIT_WINDOW_SEC * 1000);


        console.log(` [RATE LIMIT] Checking for IP=${IP}, URL=${URL}`);
        console.log(`   Current time: ${now.toISOString()}`);
        console.log(`   Cutoff time: ${cutoff.toISOString()}`);



        // очистка старых записей
        await rateLimitCollection.deleteMany({ date: { $lt: cutoff } });



        const log = await rateLimitCollection.findOne({ IP, URL, date: { $gte: cutoff } });

        if (log) {

            console.log(`   ⚙️ Found existing log: count=${log.count}, date=${log.date.toISOString()}`);

            // обновляем count и дату, чтобы окно "сдвигалось"
            await rateLimitCollection.updateOne(
                { IP, URL },
                { $inc: { count: 1 }, $set: { date: now } }
            );

            const updated = await rateLimitCollection.findOne({ IP, URL });

            console.log(`   🔄 Updated count=${updated?.count}, new date=${updated?.date.toISOString()}`);

            return updated?.count ?? 1;
        }

        // если записи не было — создаём новую
        console.log("  No existing log found. Creating new entry with count=1");

        await rateLimitCollection.insertOne({ IP, URL, count: 1, date: now });
        return 1;
    }
    getLimitSettings() {
        return { count: LIMIT_COUNT, window: LIMIT_WINDOW_SEC };
    }
}