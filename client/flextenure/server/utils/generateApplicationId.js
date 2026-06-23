// Generates application IDs in the shape the frontend already expects,
// e.g. "FLX12345678" (FLX + 8 digits).
const generateApplicationId = () => {
  const digits = Math.floor(10000000 + Math.random() * 90000000); // 8 digits
  return `FLX${digits}`;
};

module.exports = generateApplicationId;
