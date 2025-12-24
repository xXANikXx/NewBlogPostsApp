import {SessionDocument} from "../../../authorization/domain/session.entity";
import {DeviceViewModel} from "../../types/devices-view-model";

export const mapSessionToDeviceViewModel = (session: SessionDocument): DeviceViewModel => {

    return {
        ip: session.ip,
        title: session.title,
        lastActiveDate: session.iat.toISOString(),
        deviceId: session.deviceId,
    };
};