const scrubSummary = summary =>
  summary
    ? summary
        .replace(
          "Get “Community Letters” via email: a monthly overview of the latest news, events, and stories from the film photography community.",
          ""
        )
        .replace("☞", "")
        .trimLeft()
    : summary;

module.exports = { scrubSummary };
