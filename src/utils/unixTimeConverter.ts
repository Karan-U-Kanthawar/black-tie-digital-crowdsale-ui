const unixTimeConverter = (unixDate: number) => {
  return new Date(unixDate * 1000).toLocaleDateString();
};

export default unixTimeConverter;
