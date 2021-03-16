export const number2MoneyString = (input: number): string => {
  return input.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};
