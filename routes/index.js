const express = require('express');
const router = express.Router();


router.get('/', (req, res)=>{
    res.render('index');
})

router.get('/about', (req, res)=>{
    res.render('about');
})


router.get('/services', (req, res)=>{
    res.render('services');
})
    
router.get('/dashboard', (req, res) => {
    if (!req.session || !req.session.user){
        return res.redirect('/');
    }
    const parkingData = [
      { location: 'Lot A', status: 'Available', spots: 10 },
      { location: 'Lot B', status: 'Full', spots: 0 },
    ];
    res.render('dashboard', { parkingData });
  });

module.exports = router;