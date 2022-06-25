const express = require('express')
const expressLayout = require('express-ejs-layouts')
const {
    loadContact,
    findContact,
    addContact,
    cekDuplikat
} = require('./utils/contacts')
const {
    body,
    validationResult,
    check
} = require('express-validator') //untuk validasi form
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
const app = express()
const port = 3000

// menggunakan ejs
app.set('view engine', 'ejs');
app.use(expressLayout) //third party middilewere 
app.use(express.static('public')) //build-in middlewere fungsinya untuk koneksi ke gambar dll
app.use(express.urlencoded({
    extended: true
})) //buld-in middlewere fungsinya untuk mengolah data post

// konfigurasi flas
app.use(cookieParser('secret'))
app.use(session({
    cookie: {
        maxAge: 6000
    },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())


// root
app.get('/', (req, res) => {
    const karyawan = [{
            nama: "daus",
            email: "firdaus@gmail.com"
        },
        {
            nama: "salman",
            email: "salman@gmail.com"
        },
        {
            nama: "reza",
            email: "reza@gmail.com"
        }
    ]
    res.render('index', {
        title: "halaman home",
        karyawan,
        title: "halaman home",
        layout: "layouts/main-layouts"
    })
})
app.get('/about', (req, res) => {
    res.render('about', {
        title: "halaman about",
        layout: "layouts/main-layouts"
    })
})
app.get('/contact', (req, res) => {
    const contacts = loadContact()

    res.render('contact', {
        title: "halaman contact",
        layout: "layouts/main-layouts",
        contacts,
        msg: req.flash('msg')
    })
})
// nambah karyawan
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: "form tambah contact",
        layout: "layouts/main-layouts",
    })
})

// proses post data
app.post('/contact', [
    body('nama').custom((value) => {
        const duplikat = cekDuplikat(value)
        if (duplikat) {
            throw new Error('Nama Sudah Terdaftar')
        }
        return true
    }),
    check('email', 'Email Tidak Valid').isEmail(),
    check('nohp', 'No HP Tidak Valid').isMobilePhone('id-ID')

], (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        // return res.status(400).json({
        //     errors: errors.array()
        // });
        res.render('add-contact', {
            title: 'Form Tambah Data Contact',
            layout: 'layouts/main-layouts',
            errors: errors.array()
        })
    } else {
        addContact(req.body)
        // kirimkan flash-massage
        req.flash('msg', 'Data Contact Berhasil Ditambahkan')
        res.redirect('/contact')
    }
})

// halaman detail contact
app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama)

    res.render('detail', {
        title: "halaman detailContact",
        layout: "layouts/main-layouts",
        contact
    })
})


app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404</h1>')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})