import {ResultStatus} from "./resultCode";
import {HttpStatus} from "../../core/typesAny/http-statuses";

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
    switch (resultCode) {
        // Успех (обычно не маппируется, но для полноты)
        case ResultStatus.Success:
            return HttpStatus.Ok;

        // Статусы клиента (4xx)
        case ResultStatus.BadRequest:
            return HttpStatus.BadRequest; // 400
        case ResultStatus.Unauthorized:
            return HttpStatus.Unauthorized; // 401
        case ResultStatus.Forbidden:
            return HttpStatus.Forbidden; // 403
        case ResultStatus.NotFound:
            return HttpStatus.NotFound; // 404

        // Если пришло что-то неожиданное
        default:
            return HttpStatus.InternalServerError; // 500
    }
};