import React from 'react'

const MovieCard = ({movie : {title, rating, image, year, original_language}}) => {
  return (
    <div className='movie-card'>
        <img src={image ? `${image}` : "/no-movie.png"} defaultValue="/no-movie.png" alt={title} />

        <div className="mt-4">
            <h3>{title}</h3>

            <div className="content">
                <div className="rating">
                    <img src="/star.svg" alt="Star Icon" />
                    <p>{rating ? rating : "N/A"}</p>
                </div>

                {/* <span>◉</span>
                <p className="lang">{original_language}</p> */}

                <span>◉</span>
                <p className='year'>{year ? year : "N/A"}</p>
            </div>
        </div>
    </div>
  )
}

export default MovieCard