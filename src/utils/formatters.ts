export const formatCurrency = (value: number | string) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value));
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleString('pt-BR');
};