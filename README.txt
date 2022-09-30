TO RUN FRONTEND AND BACKEND: --------------------------------------------------------

    -cd into backend directory and execute
        - npm i
        - npm run servers
            - concurrently runs both frontend and backend servers
            - starts express server backend on port 3001
            - launches react frontend on port 3000

#############################################################################################

BACKEND 

BACKEN TO RUN: ----------------------------------------------------------------------

    -cd into backend directory and execute 
        - npm i
        - nodemon app.js
            - launches react frontend on port 3000

BACKEND ROUTES: ---------------------------------------------------------------------

    - "localhost:3001/" 
        - returns the user document from user.json
        - format: { "points": int }

    - GET "localhost:3001/balance" 
        - returns all payers balance
        - loops through all transactions and returns the total points for each payer
        - if id is provided, returns the total points for the payer with that id
            - "localhost:3001/balance?id=DANNON" 
                - returns the total points for DANNON
        - format: { "payer1": "points1", "payer2": "points2" }

    - POST "localhost:3001/addTx" 
        - adds a transaction to the transaction.json file
        - request body format: { "payer": string, "points": int, "timestamp": string }
        - updates user points total
        - payer and points fields are required
        - timestamp is optional, if not provided, the current time is used
        - uses addTX function from transaction.js (see IMPORTANT FUNCTIONS below)
        - response - array of all transactions

    - POST "localhost:3001/spend"
        - subtracts points from the user's total points
        - request body format: { "points": int }
        - response - [{payer1: (string), points1: (integer)}, {payer2: (string), points2: (integer)}]
        - uses spendPoints function from transaction.js (see IMPORTANT FUNCTIONS below)

    - GET "localhost:3001/addTxManual"
        - GET version of POST "localhost:3001/addTx" just in case you want to test it in the browser
        - timestamp is optional, if not provided, the current time is used
        - request format: localhost:3001/addTxManual?payer=string&points=int&timestamp=string

    - GET "localhost:3001/spendManual"
        - GET version of POST "localhost:3001/spend" just in case you want to test it in the browser
        - request format: localhost:3001/spendManual?points=int

    
BACKEND NOTES -----------------------------------------------------------------------

    - backend is built with express and node.js
    - backend is a REST API that serves data to the frontend
    - backend data is stored in json files
        - data/transactions.json - stores all transactions
        - data/users.json - stores the user data 
            - currently only points are tracked
    
    - app.js - main file that starts the server
        - defines port that server runs on    
        - routes folder contains all the routes for the server 
            - home.js - main route file that imports all other routes
            - balance.js - route for getting the balance of all payers
            - transactions.js - route for getting all transactions
        - contains middleware for parsing json data and enabling CORS

    - helperFunctions folder contains functions that are used by the routes
        - transaction.js - contains functions for adding transactions and spending points
        - balance.js - contains functions for getting the balance of all payers
             - only one function but didn't know if I would need more later    


    IMPORTANT FUNCTIONS -------------------------------------------------------------

    getAllTX() from /helperFunctions/transaction.js
        - returns all transactions from transactions.json
        - sorts transactions by timestamp, ensuring the oldest transactions are first
        - format: [{ "id": uuid, "payer": string, "points": int, "timestamp": string }, ...]

    addTX() from /helperFunctions/transaction.js
        - gets array of sorted transactions from getAllTX()    
        - push transaction to array
        - update transaction.json with new array
        - update user.json with new points total

    spendPoints() from /helperFunctions/transaction.js
        - makes a copy of sorted transactions from getAllTX()
        - performs simple check to ensure user has enough points to spend, returns if not
        - subtracts points from the user's total points, updates user.json
        - loops through transactions, subtracting points from each transaction
            - subtracts points from the pointsRemaining field of tx to preserve original value
            - if pointsRemaining is less than 0, set tx.spent to true for easy skipping on future calls
        - keep track of how many points have been spent by each payer
        - updates copy of transactions with new pointsRemaining and spent fields
        - updates transactions.json with new transactions
        - returns array of objects with payer and points spent
            - [{payer1: (string), points1: (integer)}, {payer2: (string), points2: (integer)}]

#############################################################################################

FRONTEND 

FRONTEND TO RUN: ---------------------------------------------------------------------
    -cd into frontend directory and execute "npm start"
        - launches react frontend on port 3000

FRONTEND NOTES -----------------------------------------------------------------------

    - very simple react app outlining Breeze's (my dog) rewards program!

    - uses BrowserRouter to route to 4 different pages
        - Home - http://localhost:3000
        - Balances - http://localhost:3000/balances
        - Transactions - http://localhost:3000/tx
        - Spend - http://localhost:3000/spend
    
    - uses HTTP requests to communicate with backend
        - Home - fetches and displays user points from backend - "http://localhost:3001/"
        - Balances - fetches and displays payers balance from backend - "http://localhost:3001/balance"
        - Transactions - performs a POST request to add a transaction to the backend - "http://localhost:3001/addTx"
        - Spend - performs a POST request to spend points from the backend - "http://localhost:3001/spend"

