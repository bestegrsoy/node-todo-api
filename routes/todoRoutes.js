const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const protect = require('../middlewares/authMiddleware');

// Tüm route'ları koru, giriş yapmayanların girememesi için(tokensizler)
router.get('/', protect, todoController.getAllTodos);
router.post('/', protect, todoController.createTodo);
router.get('/:id', protect, todoController.getTodobyId);
router.put('/:id', protect, todoController.updateTodo);
router.delete('/:id', protect, todoController.deleteTodo);

module.exports = router;    // router objesini başka dosyaların kullanabilmesi için dışarı aktarma işlemidir.

// Node.js’te her dosya aslında bir modüldür.
// Başka dosyaların bu modül içindeki şeylere erişebilmesi için export etmen gerekir.