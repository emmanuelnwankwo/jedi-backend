import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../swagger.json';
import MovieController from '../controllers/movie';

const router = Router();

const { getMovies, getCharacters } = MovieController;

router.get('/movies', getMovies);
router.get('/characters', getCharacters);
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocument));

export default router;
