import { Router } from 'express';
import { XMLParser } from 'fast-xml-parser';
import axios from 'axios';

// config dotenv
import dotenv from 'dotenv';
dotenv.config();

const movieRouter = Router();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

movieRouter.get('/search', async (req, res) => {
    console.log('query is: ', req.query.query);
    // console.log('query params is: ', req.query);
    try {
        const response = await axios.get(BASE_URL + '/search/movie', { params: {
            api_key: API_KEY,
            query: req.query.query
        }});
        const data = await response.data.results;
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

movieRouter.get('/trending', async(req, res) => {
    try{
        const response = await axios.get(BASE_URL + '/trending/movie/week', { params: { api_key: API_KEY } });

        const data = await response.data.results;
        res.send(data);
    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
})

movieRouter.get('/popular', async (req, res) => {
    try {
        const response = await axios.get(BASE_URL + '/movie/popular', { params: { api_key: API_KEY } });

        const data = await response.data.results;
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

movieRouter.get('/toprated', async (req, res) => {
    try {
        const response = await axios.get(BASE_URL + '/movie/top_rated', { params: { api_key: API_KEY } });

        const data = await response.data.results;
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

movieRouter.get('/showtime/:movie', async (req, res) => {
    try {
        console.log('hello before calling api')
        const response = await fetch('https://www.finnkino.fi/xml/Schedule/');
        console.log('after calling api')

        const xmlText = await response.text();
        
        const xml = new XMLParser().parse(xmlText);

        
        const movie = xml.getElementsByTagName('Show')
        console.log('movie itself is: ', movie);

        let showTimeMovies = [];

        movie.forEach(show => {
            let title = show.getElementsByTagName('Title')[0].value.toLowerCase();
            let outMovie = req.params.movie.toLowerCase();

            if (title === outMovie){
                console.log(show);
                showTimeMovies.push(show);
            }
        });
        res.status(200).json({ message: 'ok baby', xml: xml });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
} )

export default movieRouter;