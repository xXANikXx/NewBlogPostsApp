import {injectable} from "inversify";
import {
    RateLimitDocument,
    RateLimitModel
} from "../req.log.entity.ts/request_log.dto";


const LIMIT_WINDOW_SEC = 10;
const LIMIT_COUNT = 5;
@injectable()
export class RequestLogRepository {
    async increment(IP: string, URL: string): Promise<number> {
        const now = new Date();
        const cutoff = new Date(Date.now() - LIMIT_WINDOW_SEC * 1000);


        // очистка старых записей
        await RateLimitModel.deleteMany({ date: { $lt: cutoff } });



        let log: RateLimitDocument | null = await RateLimitModel.findOne({ IP, URL, date: { $gte: cutoff } });

        if (log) {

            // обновляем count и дату, чтобы окно "сдвигалось"
            log.count += 1;
            log.date = now;

            await log.save();

            return log.count;
        }

        // если записи не было — создаём новую
        const newLog = new RateLimitModel({ IP, URL, count: 1, date: now });
        await newLog.save();

        return 1;
    }


    getLimitSettings() {
        return { count: LIMIT_COUNT, window: LIMIT_WINDOW_SEC };
    }
}