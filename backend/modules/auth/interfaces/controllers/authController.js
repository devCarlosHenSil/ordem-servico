const User = require('../../infrastructure/models/UserModel');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const newUser = new User({ nome, email, senha });
    await newUser.save();
    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      usuario: { id: newUser._id, nome: newUser.nome, email: newUser.email }
    });
  } catch (err) {
    console.error('Erro register:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (!(await user.compararSenha(senha))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, usuario: { id: user._id, nome: user.nome, email: user.email } });
  } catch (err) {
    console.error('Erro login:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};