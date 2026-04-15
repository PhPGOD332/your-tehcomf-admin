export interface IFilterBudget {
    id: number;
    name: string;
    minValue: number;
    maxValue: number;
    caption: string;
    type: "budget";
    order: number;
}