const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
});

// Criptografar a senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (this.isModified('senha')) {
    this.senha = await bcrypt.hash(this.senha, 10);
  }
  next();
});

// Verificar se a senha está correta
UserSchema.methods.compararSenha = function (senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = mongoose.model('User', UserSchema);
