export interface IImage {
    id?: number;
    src: string;
    imageAlt?: string;
    width?: number;
    height?: number;
    order?: number;
}

export interface IUploadImage extends IImage {
    file: File;
    folder: string;
    src?: string;
}

export interface IFillImage {
    src: string;
    imageAlt?: string;
    fill: boolean;
}

export interface IBlobImage {
    src: string;
    title: string;
}