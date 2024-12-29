import React from 'react';
import './styles/articleGrid.style.css';
import { useDispatch } from 'react-redux';
import {
  setSelectedArticle,
  updateArticleViews,
} from '../../features/article/articleSlice';
import {
  addFavoriteArticle,
  deleteFavoriteArticle,
} from '../../features/favorite/favoriteSlice';
import ArticleCard from './ArticleCard';
import EmptyItem from '../common/EmptyItem';
import LoadingSpinner from '../common/LoadingSpinner';
import { clearComment } from '../../features/comment/commentSlice';

function ArticleGrid({ category, articleList, totalPageNum, page, loading }) {
  const dispatch = useDispatch();

  // when the user opened the article
  async function handleOpen(item) {
    dispatch(updateArticleViews(item._id));
    dispatch(setSelectedArticle({ ...item, views: item.views + 1 }));
    dispatch(clearComment());
  }

  // favorite trigger
  function handleFavorite({ isFavorite, articleId }) {
    if (isFavorite) {
      dispatch(deleteFavoriteArticle({ articleId: articleId._id }));
    } else {
      dispatch(addFavoriteArticle({ articleId: articleId._id }));
    }
  }

  if (!loading && articleList.length === 0)
    return (
      <EmptyItem
        title={'No News Yet'}
        content={
          "It seems we don't have any updates right now. Check back soon for more news!"
        }
      />
    );

  return (
    <article className="article">
      <header className="article__header">
        <h1>
          <span>{category}</span>
        </h1>
      </header>
      <div className="article__content">
        {articleList.map((item, idx) => {
          let isLast = false;
          if (articleList.length - 1 === idx) isLast = true;
          return (
            <ArticleCard
              item={item}
              key={item._id}
              handleOpen={handleOpen}
              handleFavorite={handleFavorite}
              isLast={isLast}
              totalPageNum={totalPageNum}
              page={page}
              category={category}
            />
          );
        })}
      </div>
      {loading && totalPageNum >= page && <LoadingSpinner />}
    </article>
  );
}

export default ArticleGrid;
