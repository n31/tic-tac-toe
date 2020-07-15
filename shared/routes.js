import Home from './components/Home';
import CreateGame from './components/CreateGame';
import Game from './components/Game';
import NotFound from './components/NotFound';

const routes = [
	{
		path: '/',
		exact: true,
		component: Home
	},
	{
		path: '/new',
		component: CreateGame
	},
	{
		path: '/game',
		component: Game
	},
	{
		path: '*',
		restricted: false,
		component: NotFound
	}
]

export default routes;