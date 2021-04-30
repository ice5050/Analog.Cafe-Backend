const scrubSummary = summary =>
  summary
    ? summary
        .replace(
          "Get Community Letters (articles like this) monthly, via email.",
          ""
        )
        .replace("☞", "")
        .trimLeft()
    : summary;

module.exports = { scrubSummary };
