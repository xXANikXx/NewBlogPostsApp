import {RequestLogRepository} from "../repository/request-log.repository";
import {inject, injectable} from "inversify";

@injectable()
export class LimitService {

    constructor(@inject(RequestLogRepository) private requestLogRepository: RequestLogRepository) {}

    async checkAndIncrement(IP: string, URL: string) {
        const currentCount = await this.requestLogRepository.increment(IP, URL);
        const { count: limit } = this.requestLogRepository.getLimitSettings();
        return currentCount > limit;
    }
}
