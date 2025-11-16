import {RequestLogRepository} from "../repository/request-log.repository";


export class LimitService {

    constructor(private requestLogRepository: RequestLogRepository) {}

    async checkAndIncrement(IP: string, URL: string) {
        const currentCount = await this.requestLogRepository.increment(IP, URL);
        const { count: limit } = this.requestLogRepository.getLimitSettings();
        return currentCount > limit;
    }
}
