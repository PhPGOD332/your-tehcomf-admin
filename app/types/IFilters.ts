import type {IFilterBudget} from "~/types/PortfolioFilters/IFilterBudget";
import type {IFilterColor} from "~/types/PortfolioFilters/IFilterColor";
import type {IFilterLayout} from "~/types/PortfolioFilters/IFilterLayout";
import type {IFilterType} from "~/types/PortfolioFilters/IFilterType";
import type {IColor} from "~/types/IColor";
import type {IFilterStyle} from "~/types/PortfolioFilters/IFilterStyle";

export interface IFilters {
    color: IFilterColor | IColor | null;
    layout: IFilterLayout | null;
    type: IFilterType | null;
    budget: IFilterBudget | null;
}

export type TFilter = IColor | IFilterColor | IFilterLayout | IFilterType | IFilterBudget | IFilterStyle;
export type TFiltersList = IColor[] | IFilterColor[] | IFilterLayout[] | IFilterType[] | IFilterBudget[] | IFilterStyle[];

export type TNameCategory = "color" | "layout" | "type" | "budget" | 'style';