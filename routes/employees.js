import express from 'express';
import { v4 as uuidv4 } from 'uuid'; // for id for each user
import moment from 'moment';
import fetch from 'node-fetch';

// use router from express to route the request to specific endpoints
const router = express.Router();

// create an in-memory list of users
let employees =[
    {
        firstName: 'timmu',
        lastName: 'mimi',
        hireDate: '2020-10-10',
        role: 'CEO',
        joke: 'Tom put all my records into this rectangle!',
        secondJoke: 'Stop complaining. Start creating.',
        id: 'b36c0670-8da1-430e-9a00-576a3a482732'
      },
      {
        firstName: 'timmy',
        lastName: 'mimu',
        hireDate: '2020-10-10',
        role: 'MANAGER',
        joke: 'Tom put all my records into this rectangle!',
        secondJoke: 'Stop complaining. Start creating.',
        id: 'b36c0670-8da1-430e-9a00-576a3a482732'
      }

];

// get all the employee ids
router.get('/', (req, res) =>{
    console.log(employees);
    res.send(employees);
});



//create a new employee id for the same base path /api/employees
router.post('/', async (req, res) => {
    console.log('POST Route reached');
    console.log(req.body);
    var employee ={};
    const { firstName, lastName, hireDate, role } = req.body;
    if(firstName){
        employee.firstName = firstName;
    }else{
        res.send('Please provide valid first name');
    }
    if(lastName){
        employee.lastName = lastName;
    }else{
        res.send('Please provide valid last name');
    }
    //check for hiredate format and check if it is in the past
    console.log(" original date is "+  hireDate);
    const dateFormat = 'YYYY-MM-DD';
    const toDateFormat = moment(new Date(hireDate)).format(dateFormat);
    console.log(" formatted date is "+ toDateFormat);
    var now = moment().format(dateFormat);
    console.log(now);
    if(moment(toDateFormat, dateFormat, true).isValid() && now > toDateFormat){
        employee.hireDate = hireDate;
    }else{
        res.send('Please provide valid hiredate');
    }
    // check if the role is one of the provided list of ['CEO','MANAGER','VP','LACKEY']
    var roleList = ['CEO','MANAGER','VP','LACKEY'];
    if(role && roleList.indexOf(role)>-1){
        // check if a second CEO is being added
        if(role === "CEO"){
            const ceoFound = employees.find((employee)  => employee.role === role);
            if(ceoFound){
                res.send('CEO already exists.');
            }
        }
        employee.role = role;
    }else{
        res.send('Please provide valid role name');
    }
    // get the joke for the employee
    var joke = await fetch("https://ron-swanson-quotes.herokuapp.com/v2/quotes")
        .then((response) => response.json())
        .then((body) => {
        console.log('actual response '+ body);
        return body;
        });
    //console.log(joke[0]);
    employee.joke = joke[0];
    // get the second joke for the employee
    var secondJoke = await fetch("https://quotes.rest/qod")
        .then((response) => response.json())
        .then((body) => {
        console.log('actual response '+ body);
        return body;
        });
    console.log(secondJoke);
    employee.secondJoke = secondJoke.contents.quotes[0].quote;


    const id  = uuidv4(); // generate the user id for each new employee.
    if(employee.firstName && employee.lastName && employee.hireDate && employee.role 
        && employee.joke && employee.secondJoke){
    const employeeWithid = { ...employee, id: id};
    employees.push(employeeWithid);
    res.send('Employee successfully added.');
    }
});

// get the employee by id
router.get('/:id', ( req, res) =>{
    const { id } = req.params;
    console.log(id);
    const employeeFound = employees.find((employee)  => employee.id === id);
    res.send(employeeFound);
});

// delete the employee by the ids
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    employees = employees.filter((employee) => employee.id !== id);
    res.send(`user with the id ${id} deleted`);
});

// update an employee based on what is passed from the front end
router.put('/:id', (req, res) => {

    const { id } = req.params;
    const { firstName, lastName, hireDate, role } = req.body;
    const employee = employees.find((employee) => employee.id === id);
    if(firstName){
        employee.firstName = firstName;
    }
    if(lastName){
        employee.lastName = lastName;
    }
    //check for hiredate format and check if it is in the past
    console.log(" original date is "+  hireDate);
    if(hireDate){
        const dateFormat = 'YYYY-MM-DD';
        const toDateFormat = moment(new Date(hireDate)).format(dateFormat);
        console.log(" formatted date is "+ toDateFormat);
        var now = moment().format(dateFormat);
        console.log(now);
        if(moment(toDateFormat, dateFormat, true).isValid() && now > toDateFormat){
            employee.hireDate = hireDate;
        }else{
            res.send('Please provide valid hiredate');
        }
    }

// check if the role is one of the provided list of ['CEO','MANAGER','VP','LACKEY']
    if(role){
        var roleList = ['CEO','MANAGER','VP','LACKEY'];
        if(roleList.indexOf(role)>-1){
            // check if a second CEO is being added
            if(role === "CEO"){
                const ceoFound = employees.find((employee)  => employee.role === role);
                if(ceoFound){
                    res.send('CEO already exists.');
                }
            }
            employee.role = role;
        }else{
            res.send('Please provide valid role name');
        }
    }
    res.send(`user with the id ${id} updated`);

});

export default router; // export the router object from this file to be used in index.js