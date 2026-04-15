import type {IUploadWork, IWork} from "~/types/IWork";
import $api from "~/http";
import type {AxiosResponse} from "axios";

const S3_URL = 'https://s3.regru.cloud/tehcomf-s3';

const PATH_TO_IMAGES = `${S3_URL}/images/portfolio`;

export class PortfolioService {
    static async getAllWorks(): Promise<IWork[]> {
        const response = await $api.get('/portfolio');
        return response.data;
    }

    static async getWorkByName(name: string): Promise<IWork> {
        const response = await $api.get(`/portfolio/${name}`);
        return response.data;
    }

    static async deleteWork(workId: number): Promise<void> {
        const response = await $api.delete(`/portfolio/${workId}`);
        console.log(response);
    }

    static async updateWork(work: IUploadWork): Promise<AxiosResponse<IWork>> {
        return await $api.patch(`/portfolio/${work.id}`, work);
    }
}