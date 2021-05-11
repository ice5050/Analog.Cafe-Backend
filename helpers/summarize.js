const { scrubSummary } = require("./meta");

function getFirstImage(rawContent) {
  return rawContent.document.nodes.find(node => node.type === "image");
}
function trimByCharToSentence(text = "", chars = 0) {
  // string is broken down into sentences;
  // this is done by splitting it into array between
  // the most common sentence-ending punctuation marks:
  // period, exclaimation, ellipsis and question mark;
  // if string consists of a single statement, make an array
  // anyways
  const sentences = text.match(/[^\.!…\?]+[\.!…\?]+/g) || [text];
  // store
  let result = "";
  // cycle through sentences array
  sentences.forEach(sentence => {
    // if the `result` store isn't long enough
    // add a sentence, until we're out of available
    // sentences
    if (result.length < chars) result += sentence;
  });
  // return the trimmed sentence or empty string as default
  return result;
}

function summarize(textContent) {
  return scrubSummary(
    trimByCharToSentence(
      textContent
        .replace(/([.!?…])/g, "$1 ") // every common sentence ending always followed by a space
        .replace(/\s+$/, "") // remove any trailing spaces
        .replace(/^[ \t]+/, "") // remove any leading spaces
        .replace(/(\s{2})+/g, " "), // remove any reoccuring (double) spaces
      250
    )
  );
}

module.exports = { getFirstImage, trimByCharToSentence, summarize };
