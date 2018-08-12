var mysql = require("mysql");
var inquirer = require('inquirer');


var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId);
  mainMenu();
});


function mainMenu(){
  inquirer.prompt([
    {
      name: "answer",
      type: "list",
      message: "Manager View" + '\n' + "Please select an option below.",
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory','Add New Product', 'Exit']
    }
  ]).then(function(response){

    switch(response.answer){
        case 'View Products for Sale':
            viewProducts();
            break;
        case 'View Low Inventory':
            viewLowInventory();
            break;
        case 'Add to Inventory':
            addInventory();
            break;
        case 'Add New Product':
            addNewProduct();
            break;
        case 'Exit':
            console.log('\nHave a great day\n');
        default:
            connection.end();
    }
  });
}

function viewProducts(){

    //console.log("Inserting a new product...\n");
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity from products";
    connection.query(
      query,
      function(err, res) {
  
        for(let i = 0; i<res.length; i++){
          console.log("product: " + res[i].item_id + ') ---  product: '+ res[i].product_name + ' --- ' 
          + "department: " + res[i].department_name +  ' --- price: $'+ res[i].price + '--- stock quantity: ' +  res[i].stock_quantity + '\n');
        }
        mainMenu();
      }
      
    );
  
  }

  function viewLowInventory(){

    //console.log("Inserting a new product...\n");
    var query = "SELECT item_id, product_name, stock_quantity from products WHERE stock_quantity < 5";
    connection.query(
      query,
      function(err, res) {
        for(let i = 0; i<res.length; i++){
          console.log("product: " + res[i].item_id + ') --- ' + "product: "+ res[i].product_name + ' --- '
           + "stock quantiy: " + res[i].stock_quantity +  '\n');
        }
        mainMenu();
      }
      
    );
  
  }

  function addInventory(){
    
    inquirer.prompt([
        {
        name: "item",
        type: "input",
        message: "Please enter the product number you would like to update."
      },
      {
       name: "quantity",
      type: "input",
      message: "How many would you like to add?"
      
    }
    ]).then(function(response){

    var newquantity;
    var query = 'SELECT stock_quantity from products WHERE ?';
    connection.query(
        query,
        {
            item_id:response.item
        },
        function(err, res) {
      
            console.log("stock quant res: " + parseInt(res[0].stock_quantity));
            console.log("response quant: " + parseInt(response.quantity));
            var currentstock = res[0].stock_quantity;
           newquantity = parseInt(currentstock) + parseInt(response.quantity);
        }
    );
    
    console.log("new quantity: " + newquantity);
    var query = "Update products SET ? WHERE ?";
    connection.query(
      query,
      [{
        stock_quantity: newquantity
      },
      {
        item_id:response.item
      }],
      function(err, res) {
    
        viewProducts();
      }
      
    );
    });
  }