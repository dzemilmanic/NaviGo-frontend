import React, { useEffect, useState } from "react";
import "./News.css";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6; // koliko članaka po stranici
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;

  useEffect(() => {
    const fetchNews = async () => {
      try {
const response = await fetch(
  `https://newsapi.org/v2/everything?q=("logistics" OR "transport" OR "truck" OR "transportation" ) -ukraine -zelensky -war&language=en&sortBy=publishedAt&apiKey=${apiKey}`
);


        const data = await response.json();

        if (data.status === "ok") {
          const europeanArticles = data.articles.filter((article) =>
            /europe|germany|france|uk|italy|serbia|croatia|spain|netherlands|poland|belgium/i.test(
              article.title + " " + article.description
            )
          );
          setArticles(europeanArticles);
        } else {
          setError("Failed to load news");
        }
      } catch (error) {
        console.error("Greška pri fetchovanju vesti:", error);
        setError("Error loading news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [apiKey]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getSourceName = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace("www.", "").split(".")[0];
    } catch {
      return "Unknown";
    }
  };

  // Pagination logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <section className="news-section">
        <div className="news-loading">
          <div className="loading-spinner"></div>
          <h3>Loading latest news...</h3>
          <p>Fetching the most recent transportation and logistics updates</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="news-section">
        <div className="news-error">
          <h3>⚠️ Unable to load news</h3>
          <p>Please try again later</p>
        </div>
      </section>
    );
  }

  return (
    <section className="news-section">
      <div className="news-header">
        <div className="news-header-content">
          <h2 className="news-title">Transportation & Logistics News</h2>
        </div>
      </div>

      <div className="news-container">
        <div className="news-grid">
          {currentArticles.map((article, index) => (
            <article key={index} className="news-card">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-card-link"
              >
                <div className="news-image-container">
                  {article.urlToImage ? (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="news-image"
                      onError={(e) => {
                        e.target.src =
                          "https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=800";
                      }}
                    />
                  ) : (
                    <div className="news-image-placeholder">
                      <span>📰</span>
                    </div>
                  )}
                  <div className="news-image-overlay">
                    <span className="news-read-more">Read Full Article →</span>
                  </div>
                </div>

                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-source">
                      {getSourceName(article.url)}
                    </span>
                    <span className="news-divider">•</span>
                    <span className="news-date">
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>

                  <h3 className="news-article-title">{article.title}</h3>

                  {article.description && (
                    <p className="news-description">
                      {article.description.length > 140
                        ? article.description.slice(0, 140) + "..."
                        : article.description}
                    </p>
                  )}
                </div>
              </a>
            </article>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="news-empty">
            <h3>No news found</h3>
            <p>No European transportation news available at the moment</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="news-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  className={`news-page-btn ${
                    number === currentPage ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default News;
