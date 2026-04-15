import type {IFilterType} from "~/types/PortfolioFilters/IFilterType";
import type {IColor} from "~/types/IColor";
import type {IFilterLayout} from "~/types/PortfolioFilters/IFilterLayout";
import type {IFilterStyle} from "~/types/PortfolioFilters/IFilterStyle";
import type {IFilterColor} from "~/types/PortfolioFilters/IFilterColor";

export interface TFormPortfolioInputs {
    title: string;
    subtitle: string;
    name: string;
    sizesRoom: string;
    sizesFurniture: string;
    housingMaterial: string;
    facadeMaterial: string;
    tableTopMaterial: string;
    furnitureAccessories: string;
    description: string;
    price: number;
    type: IFilterType;
    color: IFilterColor;
    bodyColor: IColor;
    tableTopColor: IColor;
    layout: IFilterLayout;
    style: IFilterStyle;
    images: ImageData[];
}

export enum TPortfolioInputsNames {
    title = 'title',
    subtitle = 'subtitle',
    name = 'name',
    sizesRoom = 'sizesRoom',
    sizesFurniture = 'sizesFurniture',
    housingMaterial = 'housingMaterial',
    facadeMaterial = 'facadeMaterial',
    tableTopMaterial = 'tableTopMaterial',
    furnitureAccessories = 'furnitureAccessories',
    description = 'description',
    price = 'price',
    type = 'type',
    color = 'color',
    bodyColor = 'bodyColor',
    tableTopColor = 'tableTopColor',
    layout = 'layout',
    style = 'style'
}

export interface TFormLoginInputs {
    email: string;
    password: string;
}

export interface TLimitedFormInputs {
    firstName: string;
    mobilePhone: string;
    date: Date;
}

export enum TFormPortfolioInputsNames {
    firstName = 'firstName',
    mobilePhone = 'mobilePhone',
    note = 'note',
    date = 'date',
}

export enum TLoginInputsNames {
    email = 'email',
    password = 'password'
}