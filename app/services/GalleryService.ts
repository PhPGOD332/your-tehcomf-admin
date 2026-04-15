import $api from "~/http";
import type {IImage, IUploadImage} from "~/types/IImage";
import type {AxiosResponse} from "axios";

const S3_URL = 'https://s3.regru.cloud/tehcomf-s3';

const PATH_TO_IMAGES = `${S3_URL}/images/portfolio`;

export class GalleryService {
    static async addImage(image: IUploadImage): Promise<AxiosResponse<IImage>> {
        const formData = new FormData();

        formData.append("file", image.file);
        formData.append("imageAlt", image.imageAlt ?? '');
        formData.append("folder", image.folder);
        formData.append("order", image.order ? image.order.toString() : "0");

        return await $api.post('/gallery/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}