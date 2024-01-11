const express = require('express');
const cors = require('cors');
const appRoute = require('./routes/route');
require("dotenv").config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: "*", credentials: true }));