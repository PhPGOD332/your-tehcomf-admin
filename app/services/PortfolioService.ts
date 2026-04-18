import type {IUploadWork, IWork} from "~/types/IWork";
import $api from "~/http";
import type {AxiosResponse} from "axios";

const S3_URL = 'https://s3.regru.cloud/tehcomf-s3';

const PATH_TO_IMAGES = `${S3_URL}/images/portfolio`;

export class PortfolioService {
    static async getAllWorks(): Promise<AxiosResponse<IWork[]>> {
        return await $api.get('/portfolio');
    }

    static async getWorkByName(name: string): Promise<AxiosResponse<IWork>> {
        return await $api.get(`/portfolio/${name}`);
    }

    static async deleteWork(workId: number): Promise<AxiosResponse<{success: true}>> {
        return await $api.delete(`/portfolio/${workId}`);
    }

    static async updateWork(work: IUploadWork): Promise<AxiosResponse<IWork>> {
        return await $api.patch(`/portfolio/${work.id}`, work);
    }

    static async createWork(work: IUploadWork): Promise<AxiosResponse<IWork>> {
        return await $api.post(`/portfolio`, work);
    }
}