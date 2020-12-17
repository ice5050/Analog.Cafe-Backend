const cachegoose = require("cachegoose");

const revalidateOnArticleUpdate = ({ articleId }) => {
  if (articleId) {
    cachegoose.clearCache(`authors-${articleId}`);
    cachegoose.clearCache(`article-${articleId}`);
    cachegoose.clearCache(`next-article-${articleId}`);
  }
  cachegoose.clearCache(`rss`);
};

module.exports = {
  revalidateOnArticleUpdate
};
