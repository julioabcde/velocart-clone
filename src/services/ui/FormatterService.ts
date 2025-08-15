export class FormatterService {
  static formatRupiah(value: number | string | undefined): string {
    const numberValue = Number(value);
    if (isNaN(numberValue)) {
      return "-";
    }

    return numberValue.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  static formatStock(stock: number | string | undefined): string {
    const numberStock = Number(stock);
    if (isNaN(numberStock)) {
      return "-";
    }

    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: numberStock % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    });

    return formatter.format(numberStock);
  }
}