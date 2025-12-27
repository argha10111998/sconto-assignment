const express = require('express');
const mongoose = require('mongoose');
const voucher = require("../models/voucher");
class dbConn{
    constructor(uri){
        this.app = express();
        this.port = 5000;
        this.uri = uri;
    }
    async getConnection(){
        try{
            const connect = await mongoose.connect(this.uri,{
            });
            console.log("Mongodb connection successfull!");
            //res.send('connected');
            // await voucher.deleteMany(); // optional: avoid duplicates

            // await voucher.insertMany([
            //     { brand: "Amazon", value: 200 },
            //     { brand: "Zomato", value: 100 },
            //     { brand: "Flipkart", value: 300 },
            //     { brand: "Myntra", value: 250 },
            //     { brand: "Swiggy", value: 150 },
            // ]);

            // console.log("Vouchers seeded successfully");
            // process.exit();
        }
        catch(error){
            console.log(error);
        } 
    }
}
module.exports = dbConn;