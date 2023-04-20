const express = require('express');
const app = express();
var cors = require('cors')
app.use(cors())
app.use(express.json());
const path = require('path');
const configRoutes = require('./routes');
const port = 3001;
app.use(express.static('public'))
async function main() {
    configRoutes(app);
    app.listen(port, '192.168.1.9', async () => {
        console.log(`Your server is running on http://localhost:${port}`);
    })
}

main().catch(console.error)