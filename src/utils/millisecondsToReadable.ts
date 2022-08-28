const millisecondsToReadable = (secondsData: string) => {
  let seconds = parseFloat(secondsData);
  if (seconds > 0) {
    seconds = Number(seconds);
    seconds = Math.abs(seconds);
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondDiff = Math.floor(seconds % 60);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""}`;
    }

    if (hours > 0) {
      return `${hours} hr${hours > 1 ? "s" : ""}`;
    }

    if (minutes > 0) {
      return `${minutes} min${minutes > 1 ? "s" : ""}`;
    }

    if (secondDiff > 0) {
      return `${secondDiff} sec${secondDiff > 1 ? "s" : ""}`;
    }
  }
  return "";
};

export default millisecondsToReadable;
