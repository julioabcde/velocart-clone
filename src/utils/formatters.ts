export const Formatters = {
  rupiah: (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  },

  date: (value: string | Date) => {
    return new Date(value).toLocaleDateString('id-ID');
  },

  dateTime: (value: string | Date) => {
    return new Date(value).toLocaleString('id-ID');
  },

  boolean: (value: boolean) => {
    return value ? 'Yes' : 'No';
  },

  number: (value: number, decimals = 0) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  },
};