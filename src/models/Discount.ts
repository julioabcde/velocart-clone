export interface Discount {
    id? : number;
    discountId: string;
    discountName: string;
    discountPrice: number;
    discountPercentage: number;
    startDate: Date;
    endDate: Date;
}