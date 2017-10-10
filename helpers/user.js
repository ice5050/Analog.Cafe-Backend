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

module.exports = {
  toShowingObject,
  parseButtons
}
