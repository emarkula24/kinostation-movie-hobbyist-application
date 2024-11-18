import { Router } from 'express';
import { XMLParser } from 'fast-xml-parser';
import axios from 'axios';

// config dotenv
import dotenv from 'dotenv';
dotenv.config();

const movieRouter = Router();

const API_KEY = process.env.TMDB_API_KEY;
// const BASE_URL = "https://api.themoviedb.org/3/movie/550?api_key=5744b312c293506a27b0b3352265c186";
const BASE_URL = "https://api.themoviedb.org/3";

movieRouter.get('/trending', async(req, res) => {
    try{
        const response = await axios.get(BASE_URL + '/trending/movie/week', { params: { api_key: API_KEY } });

        // const data = await response.data.results.slice(0, 20);
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

export default movieRouter;