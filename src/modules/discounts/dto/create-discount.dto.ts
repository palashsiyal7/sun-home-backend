export class CreateDiscountDto {
  title: string;
  validFrom: Date;
  validTo: Date;
  percent: number;
  maxAmount: number;
  flatAmount?: number; // Optional flat discount amount
  redemptionLimit: number;
}
