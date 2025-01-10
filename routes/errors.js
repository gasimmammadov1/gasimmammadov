const express = require('express') // yonlendirmelerin islemesi ucun expresi daxil etdik
const router = express.Router() // hemcinin expressdeki router class'ni da import etdik

router.get('/403', (req, res) => { 
    res.render('site/errors/403')
  })

module.exports = router