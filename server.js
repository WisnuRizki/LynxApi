const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection : {
        host: '127.0.0.1',
        user : 'postgres',
        password: 'postgres',
        database : 'lynxdatabase'
    }
})



const app = express();

app.use(express.json());
app.use(cors())
app.use(express.static('/uploads'));

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads')
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})

const database = [];

const upload = multer({storage:storage})

app.get('/',(req,res) => {
    db.select('*').from('produk').then(data => {
        res.json(data)
    })
})

app.post('/kirimImage',upload.single('image'),(req,res) => {
    res.json(req.file.filename)
})

app.get('/tampilProduk/:filename',(req,res) => {
    const {filename} = req.params;
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname , 'uploads/' + filename);
    console.log(fullfilepath)
    return res.sendFile(fullfilepath)
})

app.post('/kirimKeranjang',(req,res) => {
    console.log(req.body.isiKeranjang,req.body.harga)
    const {isiKeranjang,harga} = req.body;
    for(let i = 0; i < isiKeranjang.length; i++){
        db('keranjang').insert({
            namapemesan: 'wisnu',
            nama : isiKeranjang[i].nama,
            jumlah : isiKeranjang[i].jumlah,
            harga : isiKeranjang[i].harga,
            totalharga: harga
        }).then(console.log('sukses'))
    }
})

app.listen(3001,()=> {
    console.log('server listening at port 3001')
})