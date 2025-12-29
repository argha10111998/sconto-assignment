# Setup Instructions

1. Clone repo
   git clone https://github.com/argha10111998/sconto-assignment.git

2. Install dependencies
   npm install
   
3. Update .env variables according to your need
   -MONGODB_URI
   -JWT_SECRET
   -PORT

3. Start server
   nodemon index.js

4. add token to requests after login returns token
   format:
   Authorization: Bearer <token>

5. Predefined Voucherids
   -Amazon "69510ef6028877ce3925fc9a"
   -Zomato "69510ef7028877ce3925fc9b"
   -Flipkart "69510ef7028877ce3925fc9c"
   -Myntra "69510ef7028877ce3925fc9d"
   -Swiggy 69510ef7028877ce3925fc9e

6. import Sconto Assignment Postman Collection.postman_collection to see test examples.