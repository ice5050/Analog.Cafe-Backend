function toShowingObject (user) {
  const { id, twitterId, title, image, text, suspend, buttons, role } = user
  return { id, twitterId, title, image, text, suspend, buttons, role }
}

module.exports = {
  toShowingObject
}
