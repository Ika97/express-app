import { Article } from '../../models/article.model';
import { IArticleQuery, IArticleDocument } from '../../interfaces/article';
import * as RSS from 'rss';
import { DESCRIPTION } from '../../utils/misc';
import { siteUrl } from '../../utils/url.helper';
import { ConfigurationRegistry } from '../../config/configuration-registry';

export class ArticlesHelper {
  private static instance: ArticlesHelper = null;

  public static getInstance() {
    if (this.instance === null) {
      this.instance = new ArticlesHelper();
    }
    return this.instance;
  }

  public getByWordpressId = async (wordpressId) => {
    let article = await Article.findByWordpressId(wordpressId);
    if (article) {
      this.getSocialMedia(article);
      return article;
    } else {
      throw new Error('error');
    }
  }

  public getByYearMonth = async (year, month) => {
    let articles = await Article.findByYearMonth(year, month);
    if (articles) {
      return articles;
    } else {
      throw new Error('error');
    }
  }

  public getRecentList = async (count = 5, useCached = true, saveCached = true) => {
    return Article.find({})
      .sort({createdAt: -1})
      .limit(count)
      .exec()
      .then((articles) => {
        return articles;
      });
  }

  public getSocialMedia = (article) => {
    const encodedUrl = encodeURIComponent(siteUrl(article.path));
    const encodedTitle = encodeURIComponent(article.title);
    const encodedContent = '%0D%0AI+thought+you%27d+be+interested+in+this%3A%0D%0A' + encodedUrl;
    const social = {
      twitter: '',
      facebook: '',
      linkedIn: '',
      mailTo: ''
    };

    social.twitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    social.facebook = `https://www.facebook.com/sharer.php?u=${encodedUrl}`;
    social.linkedIn = 'https://www.linkedin.com/shareArticle?mini=true&url=' +
      `${encodedUrl}` +
      '&title=' +
      `${encodedTitle}` +
      '&summary=&source=';
    social.mailTo = `mailto:?Subject=${encodedTitle}&Body=${encodedContent}`;
    article.social = social;
  }

  public getFeaturedEpisodes = async (code: string) => {
    let episodes = await Article.getFeaturedByCode(code);

    if (episodes && episodes.length > 0) {
      return episodes;
    } else {
      return [];
    }
  }

  public getAll = async () => {
    let articles = await Article.findAll();

    if (articles && articles.length > 0) {
      let baseUrl = ConfigurationRegistry.getInstance().getBaseUrl();
      let feed = new RSS({
        title: 'Stansberry Investor Hour',
        site_url: baseUrl,
        description: DESCRIPTION,
        feed_url: siteUrl('/rss')
      });

      articles.forEach((article: IArticleDocument) => {
        feed.item({
          title: article.title,
          description: article.excerpt,
          guid: String(article.wordpressId),
          date: article.createdAt,
          url: siteUrl(article.path)
        });
      });

      return feed.xml();
    } else {

      throw new Error('error');
    }
  }

  public getAvailablePeopleCodes = async (): Promise<string[]> => {
    return Article['getAvailablePeopleCodes']();
  }

  public getNextEpisode = async (currentEpisodeNumber) => {
    return Article.getNextEpisode(currentEpisodeNumber);
  }

  public search = async (query: IArticleQuery): Promise<{
    totalCount: number,
    results: object[],
  }> => {
    return Article.search(query);
  }
}
