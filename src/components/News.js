import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';


const News = (props) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
        

    const updateNews = async () =>{
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=452f340d5f2b421986f1219d4334d49f&page=${page}&pageSize=${props.pagesize}`;
        // setLoading(true);     //<---------
        let data = await fetch(url);
        let parseData = await data.json();
        setArticles(parseData.articles);
        setTotalResults(parseData.totalResults);
        setLoading(false);
    }

    useEffect(() =>{
        updateNews();
    },[])

    const fetchMoreData = async() => {
        
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=452f340d5f2b421986f1219d4334d49f&page=${page+1}&pageSize=${props.pagesize}`;
        setLoading(true)
        let data = await fetch(url);
        let parseData = await data.json();
        setArticles(articles.concat(parseData.articles));
        setTotalResults(parseData.totalResults);
        setLoading(false);
        
      }
    
    return (
      <>
        <h1 className='text-center'  style={{marginTop:"75px"}}>PankajNews- top headlines on {props.category} </h1>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}
        >
            <div className="container">
        <div className="row">
        {articles.map((element)=>{
            return <div className="col-md-4" key={element.url}>
            <NewsItem title={element.title?element.title.slice(0,45):""} description={element.description? element.description.slice(0,88):""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
            </div>
        })}
      </div>
      </div>
        </InfiniteScroll>
      </>
    )
}

News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category:  "general"
}

News.propTypes = {
    country: PropTypes.string,
    pagesize: PropTypes.number,
    category:  PropTypes.string,
}

export default News