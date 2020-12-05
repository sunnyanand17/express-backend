import express from 'express'; // import the express web framework
import bodyParser from 'body-parser'; // for parsing body in the rest request
import employeeRoutes from './routes/employees.js'; // import the employee routes
import cors from 'cors';

// initialize the express app
const app = express();
// initialize the port for the app
const PORT = 4000;
// to allow frontend to backend integration
app.use(cors());
app.use(express.json());

// initialize the app to be using json body parser
app.use(bodyParser.json());

// use the routes from the base path of /api/employees
app.use('/api/employees', employeeRoutes);

// creating the root route for the index page
app.get('/', (req, res) => {
    console.log('Reached home page and logged the request');
    res.send('Welcome to employee home page.');
});


// make the app listen for incoming request
app.listen(PORT, () => console.log(`Server started and listening on port http://localhost:${PORT}`));


