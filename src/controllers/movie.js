/* eslint-disable no-plusplus */
import Helpers from '../utils/helpers';

const axios = require('axios');

const { successResponse, errorResponse } = Helpers;

let arrayObject = [];
const characters = async (number = 1) => {
  const response = await axios.get(`https://swapi.co/api/people/?page=${number}`);
  const { results, next } = response.data;
  for (let index = 0; index < results.length; index++) {
    arrayObject.push(results[index]);
  }
  if (next !== null) {
    await characters(number + 1);
  } else {
    return false;
  }
};
/**
 * A collection of methods that controls user's interaction via the User routes
 *
 * @class MovieController
 */
class MovieController {
  /**
     * Gets all the movies with parameters
     *
     * @static
     * @param {Request} req - The request from the endpoint.
     * @param {Response} res - The response returned by the method.
     * @returns { JSON } A JSON response with the movies details.
     * @memberof MovieController
     */
  static async getMovies(req, res) {
    try {
      const response = await axios.get('https://swapi.co/api/films');
      const { results } = response.data;
      const newData = [];
      for (let i = 0; i < results.length; i++) {
        newData.push({
          title: results[i].title,
          opening_crawl: results[i].opening_crawl,
          director: results[i].director,
          producer: results[i].producer,
          release_date: results[i].release_date
        });
      }
      const data = newData.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      successResponse(res, data, 200);
    } catch (error) {
      errorResponse(res, { code: error.statusCode, message: error.message });
    }
  }

  /**
     * Gets the movie characters
     *
     * @static
     * @param {Request} req - The request from the endpoint.
     * @param {Response} res - The response returned by the method.
     * @returns { JSON } A JSON response with the movie characters.
     * @memberof MovieController
     */
  static async getCharacters(req, res) {
    try {
      arrayObject = [];
      const { gender, name, by } = req.query;
      await characters();
      const newData = [];
      for (let i = 0; i < arrayObject.length; i++) {
        newData.push({
          name: arrayObject[i].name,
          height: arrayObject[i].height,
          gender: arrayObject[i].gender
        });
      }
      let array = [];
      if (gender) array = newData.filter((x) => x.gender === gender);
      if (name) array = newData.filter((x) => x.name === name);
      if (by) array = newData.sort((a, b) => a.by - b.by);
      successResponse(res, (array.length === 0) ? newData : array, 200);
    } catch (error) {
      errorResponse(res, { code: error.statusCode, message: error.message });
    }
  }
}

export default MovieController;
