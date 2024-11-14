import axios from "axios"
import "./Reviews.css"
import { useState, useEffect } from "react"


const url = process.env.REACT_APP_API_URL

function Reviews() {

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios.get(url + "/reviews")
          .then(response => {
            console.log(response.data)
            setReviews(response.data);
          }).catch(error => {
            alert(error.response.data.error ? error.response.data.error : error)
          })
      }, [])

    return (
        <div>
             <ul>
                {
                  Array.isArray(reviews) && reviews.map(review => (
                    <li key={review.review_id}>
                        <h3>{review.movie_title}</h3>
                        <img src={review.movie_image} alt={review.movie_title} />
                        <p><strong>Rating:</strong> {review.review_rating} / 5</p>
                        <p><strong>Review:</strong> {review.review_text}</p>
                        <p><strong>Created At:</strong> {new Date(review.review_created_at).toLocaleString()}</p>
                        <p><strong>Description:</strong> {review.movie_description}</p>
                    </li>
                  ))
                }
            </ul>
        </div>
    )
}

export default Reviews;