import $api from "~/http";
import type {IFilterBudget} from "~/types/PortfolioFilters/IFilterBudget";
import type {IFilterColor} from "~/types/PortfolioFilters/IFilterColor";
import type {IFilterLayout} from "~/types/PortfolioFilters/IFilterLayout";
import type {IFilterType} from "~/types/PortfolioFilters/IFilterType";
import type {IColor} from "~/types/IColor";
import type {IFilterStyle} from "~/types/PortfolioFilters/IFilterStyle";

export class PortfolioFiltersService {
    static async getFilterColors(): Promise<IFilterColor[]> {
        const response = await $api.get('/filter-colors');
        return response.data;
    }

    static async getFilterLayouts(): Promise<IFilterLayout[]> {
        const response = await $api.get('/filter-layouts');
        return response.data;
    }

    static async getFilterTypes(): Promise<IFilterType[]> {
        const response = await $api.get('/filter-types');
        return response.data;
    }

    static async getFilterBudgets(): Promise<IFilterBudget[]> {
        const response = await $api.get('/filter-budgets');
        return response.data;
    }

    static async getColors(): Promise<IColor[]> {
        const response = await $api.get('/colors');
        return response.data;
    }

    static async getStyles(): Promise<IFilterStyle[]> {
        const response = await $api.get('/filter-styles');
        return response.data;
    }
}