import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {

    constructor() {
    }

    async getDistanceInKm(lon1, lat1, lon2, lat2) {
        let p = 0.017453292519943295 // Pi/180
        let a = 0.5 - Math.cos((lat2 - lat1) * p) / 2 + Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p)) / 2
        return 12742 * Math.asin(Math.sqrt(a))
    }ß

}
