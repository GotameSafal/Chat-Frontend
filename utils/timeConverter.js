export const timeConverter = (time) => {
  const updatedTime = new Date(time);
  return updatedTime.toLocaleString();
};
