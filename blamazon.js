const mysql = require('mysql');
require('dotenv').config();
const inquirer = require('inquirer');
const chalk = require('chalk');
const strpad = require('strpad');
var loginID = 1; // guest user
var loggedInAs = 'guest';

const connection = mysql.createConnection({
    host: process.env.MYQSL_HOST,
    port: process.env.MYQSL_PORT,
    user: 'root',
    password: process.env.MYQSL_PASS,
    database: 'blamazonDB'
});

console.log('\n\n\n\n\n\n\n\n' + '  ' + chalk.bgCyan(strpad.center('', 55)));
console.log('  ' + chalk.black.bgCyan(strpad.center('***************************', 55)));
console.log('  ' + chalk.black.bold.bgCyan(strpad.center('Welcome to Blamazon!', 55)));
console.log('  ' + chalk.black.bgCyan(strpad.center('***************************', 55)));
console.log('  ' + chalk.bgCyan(strpad.center('', 55)));

function initialInquiry() {
    console.log('\n\n  ' + chalk.black.bold.bgWhiteBright(strpad.right('MAIN MENU', 55)) + '\n');
    let theChoices = [];
    switch (loggedInAs) {
        case 'guest':
            theChoices = ['Exit', 'Browse Inventory', 'View Cart/Checkout', 'Create Account', 'Login'];
            break;
        case 'user':
            theChoices = ['Exit', 'Browse Inventory', 'View Cart/Checkout', 'View Account', 'Logout'];
            break;
        case 'manager':
            theChoices = ['Exit', 'View Products for Sale', 'View Low Inventory', 'Adjust Inventory Quantity', 'Add New Product', 'View Site as User', 'View Account', 'Logout'];
            break;
        case 'administrator':
            theChoices = ['Exit', 'View Sales by Department', 'Add New Department', 'Add New User', 'View Site as Manager', 'View Site as User', 'View Account', 'Logout'];
            break;
        default:
        // code block
    };
    let theDefault = '';
    switch (loggedInAs) {
        case 'guest':
            theDefault = 'Browse Inventory';
            break;
        case 'user':
            theDefault = 'Browse Inventory';
            break;
        case 'manager':
            theDefault = 'View Products for Sale';
            break;
        case 'administrator':
            theDefault = 'View Sales by Department';
            break;
        default:
        // code block
    };
    inquirer.prompt([{
        name: 'initial',
        type: 'list',
        message: 'What would you like to do?',
        choices: theChoices,
        default: theDefault
    }]).then((answer) => {
        if (answer.initial === 'Exit') {
            cleanUpAndExit();
        } else {
            let queryPart1 = '';
            let queryPart2 = {};
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
                    queryPart1 = `SELECT * FROM accounts WHERE ?`;
                    queryPart2 = { account_id: loginID };
                    readData(queryPart1, queryPart2, viewAccount);
                    break;
                case 'Logout':
                    console.log('\n\n  ' + chalk.black.bold.bgWhiteBright(strpad.right('LOGOUT', 55)) + '\n');
                    console.log('  You are now logged out.');
                    loggedInAs = 'guest';
                    loginID = 1;
                    initialInquiry();
                    break;
                case 'View Cart/Checkout':
                    queryPart1 = `SELECT user_cart FROM accounts WHERE ?`;
                    queryPart2 = { account_id: loginID };
                    readData(queryPart1, queryPart2, viewCart);
                    break;
                case 'View Low Inventory':
                    browseProducts('low inventory');
                    break;
                case 'Adjust Inventory Quantity':
                    browseProducts(); // first we need to see the items to pick one
                    break;
                case 'Add New Product':
                    queryPart1 = `SELECT * FROM departments;`;
                    readData(queryPart1, {}, addProduct)
                    break;
                case 'Add New Department':
                    addDepartment();
                    break;
                case 'View Sales by Department':
                    queryPart1 = `
    SELECT departments.department_name, products.*
    FROM products
    LEFT JOIN departments ON products.department_id=departments.department_id
    WHERE products.sold>0
    ORDER BY departments.department_name asc;`;
                    readData(queryPart1, {}, viewSales);
                    break;
                case 'View Site as User':
                    console.log('\n  Now viewing site with user privileges...\n');
                    loggedInAs = 'user';
                    initialInquiry();
                    break;
                case 'View Site as Manager':
                    console.log('\n  Now viewing site with manager privileges...\n');
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

function cleanUpAndExit() {
    if (loginID === 1) { // guest user
        connection.query(`UPDATE accounts SET ? WHERE ?`,
            [{
                user_cart: null
            },
            {
                account_id: 1
            }],
            function (err, res) {
                if (err) { throw err };
                doExit();
            });
    } else {
        doExit();
    };
};

function doExit() {
    connection.end(function (err) {
        if (err) { throw err };
        console.log('\n\n');
        process.exit();
    });
};

function doLogin() {
    console.log('\n\n  ' + chalk.black.bold.bgWhiteBright(strpad.right('LOGIN', 55)) + '\n');
    inquirer.prompt([
        {
            name: 'user_name',
            type: 'input',
            message: 'Please enter your user name:',
            validate: checkIfValidText
        },
        {
            name: 'user_password',
            type: 'password',
            mask: '*',
            message: 'Please enter your password:',
            validate: checkIfValidText
        },
    ]).then((answer) => {
        connection.query(`SELECT account_id, user_name, user_password, first_name, last_name, account_type FROM accounts WHERE ?`, { user_name: answer.user_name }, function (err, data) {
            if (err) { throw err };
            if (data == '' || answer.user_password !== data[0].user_password) {
                if (data == '') {
                    console.log(chalk.yellowBright('\n  That user name does not exist.\n'));
                } else {
                    console.log(chalk.yellowBright('\n  The user name and password do not match.\n'));
                };
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
                console.log(`\n  Welcome, ${data[0].first_name} ${data[0].last_name}. You are now logged in to your`);
                console.log(`  ${loggedInAs} account.`);
                initialInquiry();
            };
        });
    });
}

function addProduct(data) {
    console.log('\n\n  ' + chalk.black.bold.bgWhiteBright(strpad.right('CREATE NEW PRODUCT', 55)) + '\n');
    let theDepartmentsArray = [];
    data.forEach(element => {
        theDepartmentsArray.push(`${strpad.left(element.department_id, 3)}: ${element.department_name}`);
    });
    inquirer.prompt([
        {
            name: 'department_id',
            type: 'list',
            message: 'Please select the department for this product:',
            choices: theDepartmentsArray
        },
        {
            name: 'product_name',
            type: 'input',
            message: 'Please enter the product name:',
            validate: checkIfValidText
        },
        {
            name: 'product_desc',
            type: 'input',
            message: 'Please enter the product description:',
            validate: checkIfValidText
        },
        {
            name: 'price',
            type: 'input',
            message: 'Please enter the product price:',
            validate: checkIfValidNum
        },
        {
            name: 'cost',
            type: 'input',
            message: 'Please enter the product cost:',
            validate: checkIfValidNum
        },
        {
            name: 'stock_quantity',
            type: 'input',
            message: 'Please enter quantity on-hand:',
            validate: checkIfValidNum
        }
    ]).then((answer) => {
        let theDepartmentID = parseInt(answer.department_id.split(': ')[0]);
        let theDepartmentName = answer.department_id.split(': ')[1];
        connection.query(`INSERT INTO products SET ?`,
            {
                department_id: theDepartmentID,
                product_name: answer.product_name,
                product_desc: answer.product_desc,
                price: answer.price,
                cost: answer.cost,
                stock_quantity: answer.stock_quantity,
            },
            function (err, res) {
                if (err) { throw err };
                console.log('\n\n  New product created in ' + theDepartmentName + ':\n');
                console.log('  ' + chalk.black.bold.bgWhiteBright(strpad.right(answer.product_name, 18) + strpad.left('Price: $' + parseFloat(answer.price).toFixed(2), 37)));
                console.log('  ' + chalk.bgWhite(strpad.left('', 55)));
                console.log('  ' + chalk.black.bgWhite(strpad.right('Description: ' + answer.product_desc, 55)));
                console.log('  ' + chalk.bgWhite(strpad.left('', 55)));
                console.log('  ' + chalk.black.bgWhiteBright(strpad.right('Cost: $' + parseFloat(answer.cost).toFixed(2), 25) + strpad.left('Qty Available: ' + answer.stock_quantity, 30)));
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
            validate: checkIfValidText
        },
        {
            name: 'overhead_costs',
            type: 'input',
            message: 'Please enter the overhead costs for this department:',
            validate: checkIfValidNum
        },
    ]).then((answer) => {
        connection.query(`INSERT INTO departments SET ?`,
            {
                department_name: answer.department_name,
                overhead_costs: answer.overhead_costs
            },
            function (err, res) {
                if (err) { throw err };
                console.log('\n\n  ' + chalk.black.bold.bgWhiteBright(strpad.right('DEPARTMENT HAS BEEN CREATED', 55)) + '\n');
                console.log(`  Department: ${answer.department_name}`);
                console.log(`  Overhead Costs: $${answer.overhead_costs}`);
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
            validate: checkIfValidText
        },
        {
            name: 'user_password',
            type: 'input',
            message: 'Please enter password:',
            validate: checkIfValidText
        },
        {
            name: 'first_name',
            type: 'input',
            message: 'Please enter first name:',
            validate: checkIfValidText
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'Please enter last name:',
            validate: checkIfValidText
        },
        {
            name: 'email_address',
            type: 'input',
            message: 'Please enter email address:',
            validate: checkIfValidText
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
        connection.query(`INSERT INTO accounts SET ?`,
            {
                user_name: answer.user_name,
                user_password: answer.user_password,
                first_name: answer.first_name,
                last_name: answer.last_name,
                email_address: answer.email_address,
                account_type: accountType
            },
            function (err, res) {
                if (err) { throw err };
                connection.query(`SELECT account_id FROM accounts WHERE ?`, { user_name: answer.user_name }, function (err, data) {
                    if (err) { throw err };
                    if (loggedInAs != 'administrator') { // if an administrator is creating an account
                        loginID = data[0].account_id;    // we don't want to switch out of adminstrator
                        loggedInAs = accountType;
                    };
                    console.log('\n\n  ' + chalk.black.bold.bgWhiteBright(strpad.right('YOUR ACCOUNT HAS BEEN CREATED', 55)) + '\n');
                    console.log(`  User Name:    ${answer.user_name}`);
                    console.log(`  Password:     ${answer.user_password}`);
                    console.log(`  Name:         ${answer.first_name} ${answer.last_name}`);
                    console.log(`  Email:        ${answer.email_address}`);
                    console.log(`  Account Type: ${accountType}`);
                    initialInquiry();
                });
            });
    });
};

function browseProducts(option) {
    let theQuery = `
    SELECT departments.department_name, products.product_name, products.price, products.stock_quantity
    FROM products
    LEFT JOIN departments ON products.department_id=departments.department_id;`;
    if (option === 'low inventory') {
        theQuery = `
    SELECT departments.department_name, products.product_name, products.price, products.stock_quantity
    FROM products WHERE stock_quantity<=10
    LEFT JOIN departments ON products.department_id=departments.department_id;`;
    };
    connection.query(theQuery, function (err, data) {
        if (err) { throw err };
        let theProducts = ['Back to Main Menu'];
        if (loggedInAs === 'manager') {
            data.forEach(element => {
                theProducts.push('  ' + strpad.right(element.department_name, 14) + '\t' + strpad.right(element.product_name, 18) + '\tQty:' + strpad.left(element.stock_quantity, 3));
            });
        } else {
            data.forEach(element => {
                theProducts.push('  ' + strpad.right(element.department_name, 14) + '\t' + strpad.right(element.product_name, 18) + '\t' + strpad.left('$' + element.price, 8));
            });
        };
        if (option === 'low inventory') {
            console.log('\n\n  ' + chalk.black.bold.bgWhiteBright(strpad.right('BROWSING INVENTORY WITH QTY ON HAND ≤ 10', 55)) + '\n');
        } else {
            console.log('\n\n  ' + chalk.black.bold.bgWhiteBright(strpad.right('BROWSING INVENTORY', 55)) + '\n');
        };
        selectItemFromList(theProducts);
    });
};

function selectItemFromList(theList) {
    inquirer.prompt([
        {
            name: 'select',
            type: 'list',
            message: 'Please select an item to view:',
            choices: theList
        }
    ]).then((answer) => {
        if (answer.select === 'Back to Main Menu') {
            initialInquiry();
        } else {
            let theItemToView = answer.select.split('\t')[1];
            queryPart1 = `
    SELECT departments.department_name, products.*
    FROM products
    LEFT JOIN departments ON products.department_id=departments.department_id
    WHERE ?;`;
            readData(queryPart1, { product_name: theItemToView }, viewItem);
        };
    });
};

function viewItem(data) {
    console.log('\n');
    console.log('  ' + chalk.black.bold.bgWhiteBright(strpad.right(data[0].product_name, 18) + strpad.left('Price: $' + data[0].price.toFixed(2), 37)));
    console.log('  ' + chalk.bgWhite(strpad.left('', 55)));
    console.log('  ' + chalk.black.bgWhite(strpad.right('Description: ' + data[0].product_desc, 55)));
    console.log('  ' + chalk.bgWhite(strpad.left('', 55)));
    console.log('  ' + chalk.black.bgWhiteBright(strpad.right('Item ID: ' + data[0].item_id, 12) + strpad.left('Qty Available: ' + data[0].stock_quantity, 43)));
    if (loggedInAs === 'administrator') {
        console.log(`  Qty Sold: ${data[0].sold}\n`);
        initialInquiry();
    } else {
        console.log('\n');
        let theChoices = [];
        switch (loggedInAs) {
            case 'guest':
                theChoices = ['Add to Cart', 'View Cart/Checkout', 'Back to Browse Inventory'];
                break;
            case 'user':
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
                        if (data[0].stock_quantity == 0) {
                            console.log(chalk.yellowBright('\n  We are sorry, there is no stock of this item available.\n'));
                            viewItem(data);
                        } else {
                            addToCart(data[0].item_id, data[0].stock_quantity, data[0].sold);
                        };
                        break;
                    case 'View Cart/Checkout':
                        queryPart1 = `SELECT user_cart FROM accounts WHERE ?`;
                        queryPart2 = { account_id: loginID };
                        readData(queryPart1, queryPart2, viewCart);
                        break;
                    case 'Adjust Inventory Quantity':
                        let theProductID = data[0].item_id;
                        queryPart1 = `
    SELECT departments.department_name, products.*
    FROM products
    LEFT JOIN departments ON products.department_id=departments.department_id
    WHERE ?;`;
                        readData(queryPart1, { item_id: theProductID }, adjustInventory);
                        break;
                    default:
                    // code block
                }
            };
        });
    };
};

function readData(queryPart1, queryPart2, callback, variable1, variable2) {
    connection.query(queryPart1, queryPart2, function (err, data) {
        if (err) { throw err };
        if (callback != undefined) {
            callback(data, variable1, variable2);
        } else {
            return data;
        };
    });
};

function addToCart(itemID, currentQty, currentSold) {
    inquirer.prompt([
        {
            name: 'howMany',
            type: 'input',
            message: 'How many would you like?',
            default: 1,
            validate: checkIfValidIntOver0
        }
    ]).then((answer) => {
        let howMany = parseInt(answer.howMany);
        let newQty = parseInt(currentQty) - howMany;
        let newSold = parseInt(currentSold) + howMany;
        queryPart1 = `SELECT user_cart FROM accounts WHERE ?`;
        queryPart2 = { account_id: loginID };
        if (newQty < 0) {
            inquirer.prompt([
                {
                    name: 'howMany',
                    type: 'confirm',
                    message: 'There is not enough stock to fill your order. Would you like the ' + currentQty + ' available?',
                }
            ]).then((answer) => {
                if (answer.howMany) {
                    newQty = 0;
                    newSold = parseInt(currentSold) + parseInt(currentQty);
                    howMany = parseInt(currentQty);
                    updateTheItem(queryPart1, queryPart2, itemID, newQty, newSold, howMany);
                } else {
                    newQty = 0;
                    browseProducts();
                };
            });
        } else {
            updateTheItem(queryPart1, queryPart2, itemID, newQty, newSold, howMany);
        };
    });
};

function updateTheItem(queryPart1, queryPart2, itemID, newQty, newSold, howMany) {
    connection.query(`UPDATE products SET ? WHERE ?`,
        [{
            stock_quantity: newQty,
            sold: newSold
        },
        {
            item_id: itemID
        }],
        function (err, res) {
            if (err) { throw err };
        });
    queryPart1 = `SELECT user_cart FROM accounts WHERE ?`;
    queryPart2 = { account_id: loginID };
    readData(queryPart1, queryPart2, updateCartData, itemID, howMany);
    browseProducts();
};

function updateCartData(data, itemID, howMany) {
    let theDuplicateFlag = false;
    let theData = [];
    let theNewData = [];
    if (data[0].user_cart === null) {
        theNewData.push(`${itemID},${howMany}`);
    } else {
        theData = data[0].user_cart.split('\t');
        theData.forEach(element => {
            if (element != '') {
                let theElementID = element.split(',')[0];
                let theElementQty = element.split(',')[1];
                if (parseInt(theElementID) === parseInt(itemID)) {
                    theDuplicateFlag = true;
                    let theNewQty = parseInt(theElementQty) + parseInt(howMany);
                    theNewData.push(`${theElementID},${theNewQty}`);
                } else {
                    theNewData.push(`${theElementID},${howMany}`);
                };
            };
        });
        if (theDuplicateFlag === false) {
            theNewData.push(`${itemID},${howMany}`);
        };
    };
    connection.query(`UPDATE accounts SET ? WHERE ?`,
        [{
            user_cart: theNewData.join('\t')
        },
        {
            account_id: loginID
        }],
        function (err, res) {
            if (err) { throw err };
        });
    console.log(`\n  ${howMany} added to cart.`);
};

function viewCart(data) {
    console.log('\n\n  ' + chalk.black.bold.bgWhiteBright(strpad.right('YOUR SHOPPING CART', 55)));
    if (data == null || data[0].user_cart == null) {
        console.log(chalk.yellowBright('\n  Your cart is empty.\n'));
        initialInquiry();
    } else {
        let theCart = data[0].user_cart.split('\t');
        let theIDs = [];
        let theQtys = [];
        theCart.forEach(element => {
            if (element != '') {
                theIDs.push(element.split(',')[0]);
                theQtys.push(element.split(',')[1]);
            };
        });
        let queryPart1 = `SELECT product_name, price FROM products WHERE item_id IN (' + theIDs.join(',') + ')`;
        connection.query(queryPart1, {}, function (err, data) {
            if (err) { throw err };
            let i = 0;
            let theTotal = 0;
            data.forEach(element => {
                theSubtotal = element.price * theQtys[i]
                theTotal += theSubtotal;
                console.log('  ' + chalk.black.bgWhite(strpad.right(element.product_name, 20) + strpad.left('$' + element.price.toFixed(2), 7) + ' Qty: ' + strpad.left(theQtys[i], 2) + ' Subtotal: ' + strpad.left('$' + theSubtotal.toFixed(2), 9)));
                i++;
            });
            console.log('  ' + chalk.black.bgWhite(strpad.left('-------', 55)));
            console.log('  ' + chalk.black.bold.bgWhiteBright(strpad.left('Your total is $' + theTotal.toFixed(2), 55)));
            console.log('  ' + chalk.black.bold.bgWhiteBright(strpad.left('=======', 55)));
            console.log('\n');
            inquirer.prompt([{
                name: 'checkoutNow',
                type: 'list',
                message: 'What would you like to do?',
                choices: ['Checkout', 'Continue Shopping']
            }]).then((answer) => {
                if (answer.checkoutNow === 'Checkout') {
                    inquirer.prompt([{
                        name: 'checkout',
                        type: 'list',
                        message: 'Select Submit Order to complete your purchase.',
                        choices: ['Submit Order', 'Continue Shopping']
                    }]).then((answer) => {
                        if (answer.checkout === 'Submit Order') {
                            console.log('\n\n  ' + chalk.black.bold.bgWhiteBright(strpad.right('THANK YOU!', 55)) + '\n');
                            console.log('  Thank you for your order!');
                            console.log('\n  Your order is being processed. You will receive a');
                            console.log('  confirmation email shortly.');
                            initialInquiry();
                        } else {
                            browseProducts();
                        };
                    });
                } else {
                    browseProducts();
                };
            });
        });
    };
};

function viewAccount(data) {
    console.log('\n\n  ' + chalk.black.bold.bgWhiteBright(strpad.right('YOUR ACCOUNT', 55)) + '\n');
    console.log(`  User Name:    ${data[0].user_name}`);
    console.log(`  Password:     ********`);
    console.log(`  Name:         ${data[0].first_name} ${data[0].last_name}`);
    console.log(`  Email:        ${data[0].email_address}`);
    console.log(`  Account Type: ${data[0].account_type}`);
    initialInquiry();
};

function viewSales(data) {
    console.log('\n\n  ' + chalk.black.bold.bgWhiteBright(strpad.right('SALES BY DEPARTMENT', 55)) + '\n');
    if (data.length < 1) {
        console.log('\n  No sales have been recorded yet.');
    } else {
        let theLastDeptName = '';
        let theDeptTotal = 0;
        data.forEach(element => {
            if (theLastDeptName === '') {
                console.log('  ' + strpad.left('', 75, '-'));
                console.log('  ' + chalk.whiteBright(`Department: ${element.department_name}`));
            };
            if (theLastDeptName != element.department_name && theLastDeptName != '') {
                console.log('  ' + chalk.whiteBright(`\t\t\t\t    ${strpad.right(theLastDeptName, 14)} Total Profit: ${strpad.left('$' + theDeptTotal.toFixed(2), 12)}`));
                console.log('  ' + strpad.left('', 75, '-'));
                theDeptTotal = 0;
                console.log('  ' + chalk.whiteBright(`Department: ${element.department_name}`));
            };
            let theProfit = (element.price - element.cost) * element.sold;
            theDeptTotal += theProfit;
            console.log(`  ${strpad.right(element.product_name, 18)} Sold: ${strpad.left(element.sold, 3)} Cost: ${strpad.left('$' + element.cost.toFixed(2), 7)} Price: ${strpad.left('$' + element.price.toFixed(2), 7)} Profit: ${strpad.left('$' + theProfit.toFixed(2), 9)}`);
            theLastDeptName = element.department_name;
        });
        console.log('  ' + chalk.whiteBright(`\t\t\t\t    ${strpad.right(theLastDeptName, 14)} Total Profit: ${strpad.left('$' + theDeptTotal.toFixed(2), 12)}`));
        console.log('  ' + strpad.left('', 75, '-'));
    };
    initialInquiry();
};

function adjustInventory(data) {
    console.log('\n');
    inquirer.prompt([
        {
            name: 'newQuantity',
            type: 'input',
            message: 'Please enter the new quantity:',
            validate: checkIfValidNum
        }
    ]).then((answer) => {
        connection.query(`UPDATE products set ? WHERE ?`,
            [{
                stock_quantity: answer.newQuantity
            },
            {
                item_id: data[0].item_id
            }],
            function (err, res) {
                if (err) { throw err };
                data[0].stock_quantity = answer.newQuantity;
                console.log(`\n  The quantity has been adjusted:`);
                viewItem(data);
            });
    });
};

function checkIfValidNum(answer) {
    if (Number.isNaN(parseFloat(answer))) {
        console.log('\n  This must be a number only, without a dollar sign.');
    };
    return (answer !== '' && !Number.isNaN(parseFloat(answer)));
};

function checkIfValidIntOver0(answer) {
    if (Number.isNaN(parseInt(answer)) || !answer > 0) {
        console.log('\n  This must be a number greater than zero.');
    };
    return (answer !== '' && !Number.isNaN(parseInt(answer)) && answer > 0);
};

function checkIfValidText(answer) {
    if (answer == '') {
        console.log('\n  This must not be left blank.');
    };
    return (answer !== '');
};

