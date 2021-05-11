const { getFirstImage, summarize } = require("./summarize");

// presist custom poster image
const isCustomPoster = submission => {
  const firstImageBlock = getFirstImage(submission.content.raw);
  if (!firstImageBlock) return false;
  if (!firstImageBlock.data || !firstImageBlock.data.src) return false;
  if (firstImageBlock.data.src.includes("data:")) return false;
  if (!submission.poster) return false;
  return submission.poster !== firstImageBlock.data.src ? true : false;
};

// presist custom description/`summary`
const isCustomSummary = (submission, textContent) => {
  if (!submission.summary) return false;
  if (!textContent) return false;
  const currentSummary = summarize(textContent);
  if (!currentSummary) return false;
  if (currentSummary !== submission.summary) return true;
  return false;
};
module.exports = { isCustomPoster, isCustomSummary };
