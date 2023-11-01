const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')

const app = express()
const port = process.env.PORT || 4000

// Define paths for Express config
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

// Setting up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', direktoriViews)
hbs.registerPartials(direktoriPartials)

app.use(express.static(direktoriPublic))
exports.app = app
//ini halaman/page utama
app.get('', (req, res) => {
    res.render('index', {
        judul: 'Aplikasi Cek Cuaca',
        nama: 'Alkindi Sy'
        })
    })
    //ini halaman bantuan/FAQ (Frequently Asked Questions)
    app.get('/bantuan', (req, res) => {
        res.render('bantuan', {
            judul: 'Halaman Bantuan',
            nama: 'Alkindi Sy',
            teksBantuan:'Ini adalah teks bantuan'
        })
    })
    
    app.get('/infocuaca', (req, res) => {
        if (!req.query.address) {
            return res.send({
                error: ' Kamu harus memasukan lokasi yang ingin dicari'
            })
        }
        geocode(req.query.address, (error, { latitude, longitude, 
    location } = {}) => {
            if (error){
                return res.send({error})
            }
            forecast(latitude, longitude, (error, dataPrediksi) => {
                if (error){
                    return res.send({error})
            }
                res.send({
                    prediksiCuaca: dataPrediksi,
                    lokasi: location,
                    address: req.query.address
                })
            })
        })
    })

    app.get('/bantuan/*', (req, res) => {
        res.render('404', {
            judul: '404',
            nama: 'Alkindi Sy',
            pesanKesalahan:'Artikel yang dicari tidak Ditemukan.'
        })
    })

    app.get('*', (req, res) => {
        res.render('404', {
            judul: '404',
            nama: 'Alkindi Sy',
            pesanKesalahan:'Halaman tidak DItemukan.'
        })
    })

    app.listen(4000, () => {
        console.log('Server berjalan pada port '+ port)
    })