const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userController');


router.get('/', userControllers.view);
router.post('/', userControllers.find);
router.get('/adduser', userControllers.form);
router.post('/adduser', userControllers.create);
router.get('/edituser/:id', userControllers.edit);
router.post('/edituser/:id', userControllers.update);
router.get('/:id', userControllers.delete);
router.get('/viewuser/:id', userControllers.viewall);


router.get("/about", (req, res)=>{
    res.render('about')
});

router.get("/contact", (req, res)=>{
    res.render('contact')
});

module.exports = router;
