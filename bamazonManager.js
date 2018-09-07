var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
const chalk = require('chalk');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "bootcamp",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    promptAction();

});

function promptAction() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "action",
                choices: [
                    {
                        name: "View Products for Sale", value: 1
                    },
                    {
                        name: "View Low Inventory", value: 2
                    },
                    {
                        name: "Add to Inventory", value: 3
                    },
                    {
                        name: "Add New Product", value: 4
                    },
                    {
                        name: "Exit", value: 5
                    }
                ]
            }
        ])
        .then(function (response) {
            switch (response.action) {
                case 1:
                    displayAllItem();
                    break;
                case 2:
                    lowerThanFiveItems();
                    break;
                case 3:
                    addToInventory();
                 break;
                case 4:
                    insertNewItem();
                    break;
                case 5: 
                    console.log(chalk.yellow("Logging out"))
                    connection.end();
                    break;
            }
        })
}
function displayAllItem() {
    var columns = "item_id as 'Item ID', "
    columns+= "product_name as 'Product Name', "
    columns+= "department_name as 'Department Name', "
    columns+= "price as Price , "
    columns+= "stock_quantity as 'Stock Quantity' "
  connection.query("SELECT "+ columns + " FROM products", function(err, res) {
    if (err) throw err;
    var table = res
    for(var i = 0; i < table.length; i++){
        table[i].Price ="$" + table[i].Price
    }

    console.table(table);
    promptAction(); 
    });
}
function updateQuantity(itemId, userQuantity) {
    
    var query = "update products set stock_quantity = stock_quantity + " + userQuantity +" Where item_id =" + itemId

    connection.query(
        query,
        function (error) {
            if (error) throw error;
            console.log(chalk.cyan("Stock Quantity updated"))
            promptAction();
        }
    )
}
function lowerThanFiveItems() {
    var columns = "item_id as 'Item ID', "
    columns+= "product_name as 'Product Name', "
    columns+= "department_name as 'Department Name', "
    columns+= "price as Price , "
    columns+= "stock_quantity as 'Stock Quantity', "
    columns+= "product_sales as 'Product Sales'"
    connection.query("SELECT "+ columns + " FROM products Where stock_quantity < 5", function (err, res) {
        if (err) throw err;
        var table = res
        // adding $ to prices and styling hearders
        for(var i = 0; i < table.length; i++){
            table[i].Price ="$" + table[i].Price
            table[i]["Product Sales"] ="$" +  numberWithCommas(table[i]["Product Sales"])
        }
        console.table(table);
        promptAction();
    });
}
function addToInventory() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What item would you like to increase? (item code)",
                name: "itemId",
                //add validation to this so user cannot enter and unknow item. 
            },
            {
                message: "How many would you like to add?",
                type:"input",
                name:"quantity"
                // add validation to this so user cannot ender below zero quantity.
            }
        ])
        .then(function (response) {
            updateQuantity(response.itemId,response.quantity);

        })
}
function insertNewItem(){
    inquirer
    .prompt([
        {
            type: "input",
            message: "What is the name of the item?",
            name: "name"
        },
        {
            type: "input",
            message: "What is the department of this product?",
            name: "deptName"
        },
        {
            type: "input",
            message: "What is the saling price?",
            name: "price"
        },
        {
            type: "input",
            message: "What is the quantity?",
            name: "quantity"
        }
    ])
    .then(function (response) {
        var query = "INSERT INTO products SET ?"
        connection.query(
            query,
            {
                product_name:response.name,
                department_name:response.deptName,
                price: response.price,
                stock_quantity:response.quantity
            },
            function (error) {
                if (error) throw error;
                console.log(chalk.cyan("Item has been added"))
                promptAction();
            }
        )
    })
}
function numberWithCommas(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
