const Todo = require('../models/Todo');

exports.getAllTodos = async (req, res) => {
    const todos = await Todo.find({ user: req.user._id}); // req.user._id: req.user'ı middleware kısmında set ettik yani tokeni bulunmuş. 
    // id'de tokenin içindeki id. onunla da userı bulduk
    res.json(todos);
};

exports.createTodo = async (req, res) => {
    const { title } = req.body;
    const todo = await new Todo({ title, user: req.user._id }).save();
    res.json(todo);
};

exports.getTodobyId = async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    
    if (!todo){
        return res.status(404).json({ error: "Todo bulunamadı"});
    }

    if (todo.user.toString() !== req.user._id.toString()){
        return res.status(403).json({ error: 'Bu işlem için yetkiniz yok'})
    }
    res.json(todo);
};

exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    const todo = await Todo.findById(id);
    if (!todo){
        return res.status(404).json({error: "Todo bulunamadı"});
    }
    
    if (todo.user.toString() !== req.user._id.toString()){
        return res.status(403).json({ error: 'Bu işlem için yetkiniz yok'})
    }
    
    const updatedtodo = await Todo.findByIdAndUpdate(
        id,
        {title, completed}, // Güncellenecek alanlar
        {
            returnDocument: 'after', // güncellenmiş vers. göstermesi için
            runValidators: true     // validatorsleri çalıştırmak için ()
        }
    );
    res.json(updatedtodo);
};

exports.deleteTodo = async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    
    if (!todo) {
        return res.status(404).json({ error: "Todo bulunamadı!" });
    }
    if (todo.user.toString() !== req.user._id.toString()){
        return res.status(403).json({ error: 'Bu işlem için yetkiniz yok'})
    }

    await Todo.findByIdAndDelete(id);
    res.json({ message: 'Todo silindi', todo });
};
