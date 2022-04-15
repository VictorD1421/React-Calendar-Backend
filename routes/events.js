const { Router } = require("express");
const { check } = require("express-validator");
const { getEvent, createEvent, refreshEvent, deleteEvent } = require("../controllers/events");
const { isDate } = require("../helpers/isDate");
const validateField = require("../middlewares/fieldValidators");
const { validateJWT } = require("../middlewares/validate-jwt");
const router = Router();


router.use(validateJWT);

router.get('/', getEvent);

router.post('/',
                
            [
                check('title', 'Title is an abligatory field').not().isEmpty(),
                check('start', 'Please enter a correct date').custom(isDate),
                check('end', 'Please enter a correct date').custom(isDate),
                validateField
   
            ],
            createEvent);

router.put('/:id',
            [
                check('title', 'El titulo es obligatorio').not().isEmpty(),
                check('start', 'Fecha de inicio es obligatoria').custom(isDate),
                check('end', 'Fecha de finalización es obligatoria').custom(isDate),
                validateField
            ],
 
            refreshEvent);

router.delete('/:id', deleteEvent);


module.exports = router;