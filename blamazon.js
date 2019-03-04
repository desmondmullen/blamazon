const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
var loginID = 0
var loggedInAs = 'guest';

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'vivian',
    database: 'blamazonDB'
});

console.log('\n\n********************');
console.log('Welcome to Blamazon!');
console.log('********************');

function initialInquiry() {
    console.log('\n');
    let theChoices = [];
    switch (loggedInAs) {
        case 'guest':
            theChoices = ['Browse Inventory', 'Login', 'Create Account', 'View Cart/Checkout', 'Exit'];
            break;
        case 'user':
            theChoices = ['Browse Inventory', 'View Account', 'Logout', 'View Cart/Checkout', 'Exit'];
            break;
        case 'manager':
            theChoices = ['View Products for Sale', 'View Low Inventory', 'Adjust Inventory Quantity', 'Add New Product', 'View Site as User', 'Exit'];
            break;
        case 'administrator':
            theChoices = ['View Sales by Department', 'Add New Department', 'Add New User', 'View Site as Manager', 'View Site as User', 'Exit'];
            break;
        default:
        // code block
    };
    inquirer.prompt([{
        name: 'initial',
        type: 'list',
        message: 'What would you like to do?',
        choices: theChoices
    }]).then((answer) => {
        if (answer.initial === 'Exit') {
            connection.end(function (err) {
                if (err) { throw err };
                console.log('\n\n');
                process.exit();
            });
        } else {
            switch (answer.initial) {
                case 'Browse Inventory':
                    browseProducts();
                    break;
                case 'View Products for Sale':
                    browseProducts();
                    break;
                case 'Login':
                    doLogin();
                    break;
                case 'Create Account':
                    createAccount();
                    break;
                case 'Add New User':
                    createAccount();
                    break;
                case 'View Account':
                    let queryPart1 = `SELECT * FROM accounts WHERE ?`;
                    let queryPart2 = { account_id: loginID };
                    readData(queryPart1, queryPart2, viewAccount);
                    break;
                case 'Logout':
                    loggedInAs = 'guest';
                    loginID = 0;
                    initialInquiry();
                    break;
                case 'View Cart/Checkout':
                    viewCart();
                    break;
                case 'View Low Inventory':
                    browseProducts('low inventory');
                    break;
                case 'Adjust Inventory Quantity':
                    browseProducts(); // first we need to see the items to pick one
                    break;
                case 'Add New Product':
                    readData(`SELECT department_name FROM departments`, {}, addProduct)
                    break;
                case 'Add New Department':
                    addDepartment();
                    break;
                case 'View Sales by Department':
                    viewSales();
                    break;
                case 'View Site as User':
                    console.log('\nNow viewing site with user privileges...\n');
                    loggedInAs = 'user';
                    initialInquiry();
                    break;
                case 'View Site as Manager':
                    console.log('\nNow viewing site with manager privileges...\n');
                    loggedInAs = 'manager';
                    initialInquiry();
                    break;
                default:
                // code block
            }
        };
    });
};

initialInquiry();

function doLogin() {
    console.log('\n');
    inquirer.prompt([
        {
            name: 'user_name',
            type: 'input',
            message: 'Please enter your user name:',
        },
        {
            name: 'user_password',
            type: 'password',
            mask: '*',
            message: 'Please enter your password:',
        },
    ]).then((answer) => {
        connection.query('select account_id, user_name, user_password, first_name, last_name, account_type from accounts where ?', { user_name: answer.user_name }, function (err, data) {
            if (err) { throw err };
            if (answer.user_password !== data[0].user_password) {
                console.log('\n\nThe user name and password do not match.');
                inquirer.prompt([
                    {
                        name: 'next_step',
                        type: 'list',
                        message: 'What do you want to do?',
                        choices: ['Try again', 'Back to Main Menu']
                    },
                ]).then((answer) => {
                    if (answer.next_step === 'Try again') {
                        doLogin();
                    } else {
                        initialInquiry();
                    };
                });
            } else {
                loginID = data[0].account_id;
                loggedInAs = data[0].account_type;
                console.log(`\n\nWelcome, ${data[0].first_name}. You are now logged in to your ${loggedInAs} account.`);
                initialInquiry();
            };
        });
    });
}

function addProduct(data) {
    console.log('\n');
    let theDepartmentsArray = [];
    data.forEach(element => {
        theDepartmentsArray.push(element.department_name);
    });
    inquirer.prompt([
        {
            name: 'department_name',
            type: 'list',
            message: 'Please select the department for this product:',
            choices: theDepartmentsArray
        },
        {
            name: 'product_name',
            type: 'input',
            message: 'Please enter the product name:',
        },
        {
            name: 'price',
            type: 'input',
            message: 'Please enter the product price:',
        },
        {
            name: 'cost',
            type: 'input',
            message: 'Please enter the product cost:',
        },
        {
            name: 'stock_quantity',
            type: 'input',
            message: 'Please enter quantity on-hand:',
        }
    ]).then((answer) => {
        connection.query('insert into products set ?',
            {
                department_name: answer.department_name,
                product_name: answer.product_name,
                price: answer.price,
                cost: answer.cost,
                stock_quantity: answer.stock_quantity,
            },
            function (err, res) {
                if (err) { throw err };
                console.log(`\n\nThe product has been created:`);
                console.log(`\nDepartment: ${answer.department_name}`);
                console.log(`Product: ${answer.product_name}`);
                console.log(`Price: $${answer.price}`);
                console.log(`Cost: $${answer.cost}`);
                console.log(`Quantity on Hand: ${answer.stock_quantity}\n`);
                initialInquiry();
            });
    });
};

function addDepartment() {
    console.log('\n');
    inquirer.prompt([
        {
            name: 'department_name',
            type: 'input',
            message: 'Please enter the department name:',
        },
        {
            name: 'overhead_costs',
            type: 'input',
            message: 'Please enter the overhead costs for this department:',
        },
    ]).then((answer) => {
        connection.query('insert into departments set ?',
            {
                department_name: answer.department_name,
                overhead_costs: answer.overhead_costs
            },
            function (err, res) {
                if (err) { throw err };
                console.log(`\n\nThe department has been created:`);
                console.log(`\nDepartment: ${answer.department_name}`);
                console.log(`Overhead Costs: $${answer.overhead_costs}\n`);
                initialInquiry();
            });
    });
};

function createAccount() {
    console.log('\n');
    let theQuestions = [
        {
            name: 'user_name',
            type: 'input',
            message: 'Please enter the user name you would like to use:',
        },
        {
            name: 'user_password',
            type: 'input',
            message: 'Please enter password:',
        },
        {
            name: 'first_name',
            type: 'input',
            message: 'Please enter first name:',
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'Please enter last name:',
        }
    ]
    if (loggedInAs === 'administrator') {
        theQuestions.push({
            name: 'account_type',
            type: 'list',
            message: 'Please enter the account type:',
            choices: ['user', 'manager', 'administrator']
        });
    };
    inquirer.prompt(theQuestions).then((answer) => {
        let accountType = 'user'
        if (loggedInAs === 'administrator') { accountType = answer.account_type };
        connection.query('insert into accounts set ?',
            {
                user_name: answer.user_name,
                user_password: answer.user_password,
                first_name: answer.first_name,
                last_name: answer.last_name,
                account_type: accountType
            },
            function (err, res) {
                if (err) { throw err };
                console.log(`\n\nYour account has been created:`);
                console.log(`\nUser Name: ${answer.user_name}`);
                console.log(`User Password: ${answer.user_password}`);
                console.log(`User Password: ${answer.first_name}`);
                console.log(`User Password: ${answer.last_name}`);
                if (loggedInAs === 'administrator') {
                    console.log(`Account Type: ${accountType}`);
                };
                initialInquiry();
            });
    });
};

function browseProducts(option) {
    let theQuery = 'select department_name, product_name from products';
    if (option === 'low inventory') {
        theQuery = 'select department_name, product_name, stock_quantity from products WHERE stock_quantity<=10';
    };
    connection.query(theQuery, function (err, data) {
        if (err) { throw err };
        let theProducts = [];
        if (loggedInAs === 'manager') {
            data.forEach(element => {
                theProducts.push(`${element.department_name}: ${element.product_name} Quantity on hand: ${element.stock_quantity}`);
            });
        } else {
            data.forEach(element => {
                theProducts.push(element.department_name + ': ' + element.product_name);
            });
        };
        theProducts.push('Back to Main Menu');
        console.log('\n');
        inquirer.prompt([
            {
                name: 'select',
                type: 'list',
                message: 'Please select an item to view:',
                choices: theProducts
            }
        ]).then((answer) => {
            if (answer.select === 'Back to Main Menu') {
                initialInquiry();
            } else {
                let theItemToView = answer.select.split(': ')[1];
                readData(`SELECT * FROM products WHERE ?`, { product_name: theItemToView }, viewItem);
            };
        });
    });
};

function viewItem(theItemData) {
    console.log(`\nProduct Name: ${theItemData[0].product_name}`);
    console.log(`Product Price: ${theItemData[0].price}`);
    console.log(`Quantity Available: ${theItemData[0].stock_quantity}\n`);
    let theChoices = [];
    switch (loggedInAs) {
        case 'guest' || 'user':
            theChoices = ['Add to Cart', 'View Cart/Checkout', 'Back to Browse Inventory'];
            break;
        case 'manager':
            theChoices = ['Adjust Inventory Quantity', 'Back to Browse Inventory'];
            break;
        default:
        // code block
    }
    inquirer.prompt([{
        name: 'initial',
        type: 'list',
        message: 'What would you like to do?',
        choices: theChoices
    }]).then((answer) => {
        if (answer.initial === 'Back to Browse Inventory') {
            browseProducts();
        } else {
            switch (answer.initial) {
                case 'Add to Cart':
                    addToCart();
                    break;
                case 'View Cart/Checkout':
                    viewCart();
                    break;
                case 'Adjust Inventory Quantity':
                    let theProductID = theItemData[0].item_id;
                    readData(`SELECT * FROM products WHERE ?`, { item_id: theProductID }, adjustInventory);
                    break;
                default:
                // code block
            }
        };
    });
};

function readData(queryPart1, queryPart2, callback) {
    connection.query(queryPart1, queryPart2, function (err, data) {
        if (err) { throw err };
        if (callback != undefined) {
            callback(data);
        } else {
            return data;
        };
    });
};

function addToCart() { //TODO: needs fixin.
    console.log('add to that cart!');
    initialInquiry();
};

function viewCart() { //TODO: needs fixin.
    console.log('view that cart!');
    initialInquiry();
};

function viewAccount(data) {
    console.log(`\n\nUser Name: ${data[0].user_name}`);
    console.log(`Name: ${data[0].first_name} ${data[0].last_name}`);
    console.log(`Account Type: ${data[0].account_type}\n`);
    initialInquiry();
};

function viewSales() { //TODO: needs fixin.
    console.log('view those sales!');
    initialInquiry();
};

function adjustInventory(theItemData) {
    console.log('\n');
    inquirer.prompt([
        {
            name: 'newQuantity',
            type: 'input',
            message: 'Please enter the new quantity:',
        }
    ]).then((answer) => {
        connection.query('update products set ? where ?',
            [{
                stock_quantity: answer.newQuantity
            },
            {
                item_id: theItemData[0].item_id
            }],
            function (err, res) {
                if (err) { throw err };
                theItemData[0].stock_quantity = answer.newQuantity;
                console.log(`\nThe quantity has been adjusted:`);
                viewItem(theItemData);
            });
    });
};