function toShowingObject (user) {
  const { id, twitterId, title, image, text, suspend, buttons, role } = user
  return { id, twitterId, title, image, text, suspend, buttons, role }
}

function parseButtons (buttonsJSON) {
  if (typeof buttonsJSON === 'string' || buttonsJSON instanceof String) {
    return JSON.parse(buttonsJSON)
  }
  return buttonsJSON
}

function authorNameList (authors) {
  let compiledNameList = ''
  if (authors.length === 1) {
    compiledNameList = authors[0]
  } else if (authors.length === 2) {
    // joins all with "and" but no commas
    // example: "bob and sam"
    compiledNameList = authors.join(' and ')
  } else if (authors.length > 2) {
    // joins all with commas, but last one gets ", and" (oxford comma!)
    // example: "bob, joe, and sam"
    compiledNameList =
      authors.slice(0, -1).join(', ') + ', and ' + authors.slice(-1)
  }
  return compiledNameList
}

module.exports = {
  authorNameList,
  toShowingObject,
  parseButtons
}
