import type { IUser } from "~/types/IUser";
import {makeAutoObservable, runInAction} from "mobx";
import { AuthService } from "~/services/AuthService";
import type { AxiosResponse } from "axios";
import type { AuthResponse } from "~/types/AuthResponse";
import axios from "axios";
import type { LoginDto } from "~/types/dtos/LoginDto";
import type {IUploadWork, IWork} from "~/types/IWork";
import { PortfolioService } from "~/services/PortfolioService";
import type { IFilterType } from "~/types/PortfolioFilters/IFilterType";
import type {IColor} from "~/types/IColor";
import type {IFilterLayout} from "~/types/PortfolioFilters/IFilterLayout";
import type {IFilterStyle} from "~/types/PortfolioFilters/IFilterStyle";
import {PortfolioFiltersService} from "~/services/PortfolioFiltersService";
import type {IFilterColor} from "~/types/PortfolioFilters/IFilterColor";
import type {IImage, IUploadImage} from "~/types/IImage";
import {GalleryService} from "~/services/GalleryService";
import {API_URL, PATH_TO_IMAGES, S3_URL} from "~/shared/api";
import {replace} from "react-router";

export class Store {
    user = {} as IUser;
    isAuth: boolean = false;
    isLoading: boolean = false;

    works: IWork[];
    types: IFilterType[];
    colors: IColor[];
    filterColors: IFilterColor[];
    layouts: IFilterLayout[];
    styles: IFilterStyle[];

    constructor() {
        makeAutoObservable(this);

        // makePersistable(this, {
        //     name: 'rootStore',
        //     properties: ['content'],
        //     storage: localStorage
        // })
    }

    setAuth(val: boolean) {
        this.isAuth = val;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setWorks(works: IWork[]) {
        this.works = works;
    }

    setTypes(types: IFilterType[]) {
        this.types = types;
    }

    setColors(colors: IColor[]) {
        this.colors = colors;
    }

    setFilterColors(filterColors: IFilterColor[]) {
        this.filterColors = filterColors;
    }

    setLayouts(layouts: IFilterLayout[]) {
        this.layouts = layouts;
    }

    setStyles(styles: IFilterStyle[]) {
        this.styles = styles;
    }

    async login(data: LoginDto): Promise<AxiosResponse<AuthResponse>> {
        try {
            const response = await AuthService.login({ email: data.email, password: data.password });

            if (response.data.accessToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
                this.setAuth(true);
                this.setUser(response.data.user);
            }
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async logout(): Promise<{ success: boolean }> {
        try {
            const response = await AuthService.logout(this.user);

            if (response.status === 200) {
                localStorage.removeItem('refreshToken');
            }

            return response.data;
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth(): Promise<AxiosResponse<AuthResponse>> {
        try {
            const response = await axios.post(`${API_URL}/api/auth/refresh`, {}, { withCredentials: true });

            if (response.data.accessToken) {
                this.isAuth = true;
                this.setUser(response.data.user);
            }

            return response.data;
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async getWork(workName: string): Promise<IWork> {
        const response = await PortfolioService.getWorkByName(workName);

        if (response.status === 200) {
            return response.data
        }
    }

    async getAllWorks(): Promise<IWork[]> {
        this.isLoading = true;

        try {
            const response = await PortfolioService.getAllWorks();

            if (response.status === 200) {
                runInAction(() => {
                    this.setWorks(response.data);
                });

                return response.data;
            }
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async deleteWork(workId: number): Promise<{success: true}> {
        this.isLoading = true;

        try {
            const response = await PortfolioService.deleteWork(workId);

            if (response.status === 200) {
                runInAction(() => {
                    this.setWorks(this.works.filter((work) => work.id !== workId));
                });

                return response.data;
            }
        } catch (e) {
            console.log(e.message);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async updateWork(work: IWork, newImages: File[], editorNewFiles: File[]): Promise<IWork | null> {
        const patchWork: IUploadWork = {
            ...work,
            typeId: work.type.id,
            styleId: work.style.id,
            layoutId: work.layout.id,
            colorId: work.color.id,
            bodyColorId: work.bodyColor.id,
            tableTopColorId: work.tableTopColor.id,
            imageIds: []
        };

        const imagesIds: number[] = [];

        if (newImages.length > 0) {
            for (const file of newImages) {
                const uploadImage: IUploadImage = {
                    file: file,
                    imageAlt: '',
                    folder: `${PATH_TO_IMAGES}/${work.name}/`
                }

                const imageResponse= await GalleryService.addImage(uploadImage);

                if (!imageResponse
                    || !imageResponse.data.id
                    || imageResponse.status !== 201) {
                    return null;
                }

                imagesIds.push(imageResponse.data.id);
            }

            patchWork.imageIds = imagesIds;
        }

        if (editorNewFiles.length > 0) {
            // const blobRegex = /src=["'](blob:https?:\/\/[^"']+)["']/gi;
            const blobRegex = /<img\s+([^>]*?)src=["'](blob:https?:\/\/[^"']+)["']([^>]*?)alt=["']([^"']+)["']([^>]*?)>/gi;

            for (const file of editorNewFiles) {

                const uploadImage: IUploadImage = {
                    file: file,
                    imageAlt: '',
                    folder: `${PATH_TO_IMAGES}/${work.name}/`
                }

                const imageResponse: AxiosResponse<IImage> = await GalleryService.addImage(uploadImage);

                const targetAlt = imageResponse.data.imageAlt;

                if (imageResponse.status !== 201) {
                    return {} as IWork;
                }

                let isReplaced = false;

                patchWork.description = patchWork.description.replace(blobRegex, (match, beforeSrc, fullBlobUrl, betweenSrcAlt, altValue, afterAlt) => {
                        if (!isReplaced && altValue === targetAlt) {
                            isReplaced = true;
                            const newUrl = `${S3_URL}/${PATH_TO_IMAGES}/${patchWork.name}/${imageResponse.data.src.split('/').at(-1)}`;
                            // return match.replace(fullBlobUrl, newUrl);
                            return `<img ${beforeSrc}src="${newUrl}"${betweenSrcAlt}alt="${altValue}"${afterAlt}>`;
                        }

                    return match;
                });
            }
        }

        work.images.map(image => {
            patchWork.imageIds.push(image.id ?? 0);
        });

        const response = await PortfolioService.updateWork(patchWork);

        if (response.status === 200) {
            const response = await PortfolioService.getAllWorks();

            if (response.status === 200)
                this.setWorks(response.data);
        } else {
            return null;
        }

        return response.data
    }

    async createWork(work: IWork, newImages: File[], editorNewFiles: File[]): Promise<IWork | null> {
        const patchWork: IUploadWork = {
            ...work,
            typeId: work.type.id,
            styleId: work.style.id,
            layoutId: work.layout.id,
            colorId: work.color.id,
            bodyColorId: work.bodyColor.id,
            tableTopColorId: work.tableTopColor.id,
            imageIds: []
        };

        const imagesIds: number[] = [];

        if (newImages.length > 0) {
            for (const file of newImages) {
                const uploadImage: IUploadImage = {
                    file: file,
                    imageAlt: '',
                    folder: `${PATH_TO_IMAGES}/${work.name}/`
                }

                const imageResponse= await GalleryService.addImage(uploadImage);

                if (!imageResponse
                    || !imageResponse.data.id
                    || imageResponse.status !== 201) {
                    return null;
                }

                imagesIds.push(imageResponse.data.id);
            }

            patchWork.imageIds = imagesIds;
        }

        if (editorNewFiles.length > 0) {
            // const blobRegex = /src=["'](blob:https?:\/\/[^"']+)["']/gi;
            const blobRegex = /<img\s+([^>]*?)src=["'](blob:https?:\/\/[^"']+)["']([^>]*?)alt=["']([^"']+)["']([^>]*?)>/gi;

            for (const file of editorNewFiles) {

                const uploadImage: IUploadImage = {
                    file: file,
                    imageAlt: '',
                    folder: `${PATH_TO_IMAGES}/${work.name}/`
                }

                const imageResponse: AxiosResponse<IImage> = await GalleryService.addImage(uploadImage);

                const targetAlt = imageResponse.data.imageAlt;

                if (imageResponse.status !== 201) {
                    return {} as IWork;
                }

                let isReplaced = false;

                patchWork.description = patchWork.description.replace(blobRegex, (match, beforeSrc, fullBlobUrl, betweenSrcAlt, altValue, afterAlt) => {
                    if (!isReplaced && altValue === targetAlt) {
                        isReplaced = true;
                        const newUrl = `${S3_URL}/${PATH_TO_IMAGES}/${patchWork.name}/${imageResponse.data.src.split('/').at(-1)}`;
                        // return match.replace(fullBlobUrl, newUrl);
                        return `<img ${beforeSrc}src="${newUrl}"${betweenSrcAlt}alt="${altValue}"${afterAlt}>`;
                    }

                    return match;
                });
            }
        }

        work.images.map(image => {
            patchWork.imageIds.push(image.id ?? 0);
        });

        const response = await PortfolioService.createWork(patchWork);

        const works = await this.getAllWorks();

        if (response.status === 201) {
            this.setWorks(this.works.map(work => {
                if (work.id === response.data.id) {
                    work = response.data;
                }

                return work;
            }));
        } else {
            return null;
        }

        return response.data;
    }

    async getTypes(): Promise<IFilterType[]> {
        this.isLoading = true;

        try {
            const types = await PortfolioFiltersService.getFilterTypes();

            if (types && types.length > 0) {
                runInAction(() => {
                    this.setTypes(types);
                });

                return types;
            }
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async getFilterColors(): Promise<IFilterColor[]> {
        this.isLoading = true;

        try {
            const filterColors = await PortfolioFiltersService.getFilterColors();

            if (filterColors && filterColors.length > 0) {
                runInAction(() => {
                    this.setFilterColors(filterColors);
                });

                return filterColors;
            }
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async getColors(): Promise<IColor[]> {
        this.isLoading = true;

        try {
            const colors = await PortfolioFiltersService.getColors();

            if (colors && colors.length > 0) {
                runInAction(() => {
                    this.setColors(colors);
                });

                return colors;
            }
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async getLayouts(): Promise<IFilterLayout[]> {
        this.isLoading = true;

        try {
            const layouts = await PortfolioFiltersService.getFilterLayouts();

            if (layouts && layouts.length > 0) {
                runInAction(() => {
                    this.setLayouts(layouts);
                });

                return layouts;
            }
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async getStyles(): Promise<IFilterStyle[]> {
        this.isLoading = true;

        try {
            const styles = await PortfolioFiltersService.getStyles();

            if (styles && styles.length > 0) {
                runInAction(() => {
                    this.setStyles(styles);
                });

                return styles;
            }
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }
}

export const rootStore = new Store();

export const getStore = () => rootStore;