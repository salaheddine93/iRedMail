const req = require('express/lib/request');
const res = require('express/lib/response');

const express = require('express');
const { getEmails } = require('./mail');
const app = express();
const PORT = 3000;

app.use( express.json())

app.get('/item', (req, res) => {
    /*res.status(200).send({
        item:'laptop',
        price:'5000'
    })
    */
    
   const emails = getEmails();
   res.status(200).send(emails);
})

app.post('/item/:id', (req, res) =>{
    const { id } = req.params;
    const { name } = req.body;

    if(!name){
        res.status(418).send({message : 'name is required !'})
    }

    res.send({
        item: `item ${name} with ID ${id}`,
    });
});



app.listen(
    PORT,
    () => console.log(`server available on http://localhost:${PORT}`)
);
