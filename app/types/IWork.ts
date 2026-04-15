import type {IColor} from "~/types/IColor";
import type {IFilterType} from "~/types/PortfolioFilters/IFilterType";
import type {IImage} from "~/types/IImage";
import type {IFilterLayout} from "~/types/PortfolioFilters/IFilterLayout";
import type {IFilterStyle} from "~/types/PortfolioFilters/IFilterStyle";
import type {IFilterColor} from "~/types/PortfolioFilters/IFilterColor";

export interface IWork {
    id: number;
    name: string;
    title: string;
    subtitle: string;
    // mainImage: IImage;
    images: IImage[];
    // colors: IColor[];
    style: IFilterStyle;
    layout: IFilterLayout;
    type: IFilterType;
    color: IFilterColor;
    sizesRoom: string;
    sizesFurniture: string;
    housingMaterial: string;
    facadeMaterial: string;
    tableTopMaterial: string;
    bodyColor: IColor;
    facadeColors: IColor[];
    tableTopColor: IColor;
    furnitureAccessories: string;
    price: number;
    description: string;
}

export interface IUploadWork extends IWork {
    typeId: number;
    styleId: number;
    layoutId: number;
    colorId: number;
    bodyColorId: number;
    tableTopColorId: number;
    imageIds: number[];
}