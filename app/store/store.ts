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
import {makePersistable} from "mobx-persist-store";
import type {IImage, IUploadImage} from "~/types/IImage";
import {GalleryService} from "~/services/GalleryService";

const API_URL = 'http://localhost:3001';

const S3_URL = 'https://s3.regru.cloud/tehcomf-s3';

const PATH_TO_IMAGES = `images/portfolio`;

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
            return response.data;
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async getWork(workName: string): Promise<IWork> {
        return await PortfolioService.getWorkByName(workName);
    }

    async getAllWorks(): Promise<IWork[]> {
        this.isLoading = true;

        try {
            const works = await PortfolioService.getAllWorks();

            if (works && works.length > 0) {
                runInAction(() => {
                    this.setWorks(works);
                });

                return works;
            }
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async deleteWork(workId: number): Promise<void> {
        this.isLoading = true;

        try {
            const status = await PortfolioService.deleteWork(workId);

            if (status) {
                runInAction(() => {
                    this.setWorks(this.works.filter((work) => work.id !== workId));
                });
            }
        } catch (e) {
            console.log()
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async updateWork(work: IWork, newImages: File[], editorNewFiles: File[]): Promise<IWork> {
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
        work.images.map(image => {
            imagesIds.push(image.id ?? 0);
        });

        if (newImages.length > 0) {
            for (const file of newImages) {
                const uploadImage: IUploadImage = {
                    file: file,
                    imageAlt: '',
                    folder: `${PATH_TO_IMAGES}/${work.name}/`
                }

                console.log(uploadImage);

                const imageResponse= await GalleryService.addImage(uploadImage);

                console.log(imageResponse);

                if (!imageResponse.data.id || imageResponse.status !== 201) {
                    return {} as IWork;
                }

                imagesIds.push(imageResponse.data.id);
            }

            patchWork.imageIds = imagesIds;
        }

        if (editorNewFiles.length > 0) {
            const blobRegex = /src=["'](blob:http?:\/\/[^"']+)["']/gi;

            for (const file of editorNewFiles) {
                const uploadImage: IUploadImage = {
                    file: file,
                    imageAlt: '',
                    folder: `${PATH_TO_IMAGES}/${work.name}/`
                }

                const imageResponse: AxiosResponse<IImage> = await GalleryService.addImage(uploadImage);

                if (imageResponse.status !== 201) {
                    return {} as IWork;
                }

                patchWork.description = patchWork.description.replace(blobRegex, (match, fullBlobUrl) => {
                    const newUrl = `${S3_URL}/${PATH_TO_IMAGES}/${patchWork.name}/${imageResponse.data.src.split('/').at(-1)}`;
                    return match.replace(fullBlobUrl, newUrl);
                });
            }
        }

        console.log(patchWork);

        const response = await PortfolioService.updateWork(patchWork);

        if (response) {
            this.setWorks(this.works.map(work => {
                if (work.id === response.data.id) {
                    work = response.data;
                }

                return work;
            }));
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