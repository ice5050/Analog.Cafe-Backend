const cachegoose = require("cachegoose");
const redisDeletePattern = require("redis-delete-pattern");

const redisClient = require("./redis");

const revalidateOnArticleUpdate = props => {
  // delete individual article cache components
  (() => {
    if (!props) return;
    const { articleId } = props;
    if (!articleId) return;
    cachegoose.clearCache(`authors-${articleId}`);
    cachegoose.clearCache(`article-${articleId}`);
    cachegoose.clearCache(`next-article-${articleId}`);
  })();

  // clear RSS cache
  cachegoose.clearCache(`rss`);

  // clear list cache by pattern
  redisDeletePattern(
    { redis: redisClient, pattern: "cacheman:cachegoose-cache:list-*" },
    (error, keys) => {
      // `list-author-${authorId}`
      // `list-features`
      // `list-exec-${cacheKey}`
      // `list-count-${cacheKey}`
      if (error) console.log(`Error clearing cache keys: ${keys}`);
    }
  );
};

module.exports = {
  revalidateOnArticleUpdate
};
