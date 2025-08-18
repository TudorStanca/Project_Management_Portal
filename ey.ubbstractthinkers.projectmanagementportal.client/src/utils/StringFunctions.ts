export const truncateDescription = (description: string) => {
  const words = description.split(" ");
  let truncated = "";

  for (const word of words) {
    if ((truncated + word).length <= 100) {
      truncated += word + " ";

      if (word.endsWith(".")) break;
    }
  }
  return truncated.trim();
};
