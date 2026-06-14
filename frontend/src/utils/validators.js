export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const validateSplits = (splits, totalAmount) => {
  const sum = splits.reduce(
    (acc, split) => acc + parseFloat(split.amountOwed || 0),
    0,
  );
  return Math.abs(sum - totalAmount) < 0.01;
};
