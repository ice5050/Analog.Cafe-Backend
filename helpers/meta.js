const { getFirstImage, summarize } = require("./summarize");

const scrubSummary = summary =>
  summary
    ? summary
        .replace(
          "Get “Community Letters” via email: a monthly overview of the latest news, events, and stories from the film photography community.",
          ""
        )
        .replace("☞", "")
        .replace("What’s new? ", "")
        .replace("✪ Note: ", "")
        .replace("Note from the editor. ", "")
        .trimLeft()
    : summary;

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

module.exports = { scrubSummary, isCustomPoster, isCustomSummary };
