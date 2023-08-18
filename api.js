const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Conectar ao MongoDB (substitua a URL pelo seu próprio link de conexão)
mongoose.connect('mongodb+srv://alisson:Aj17062010@cluster0.ezlmf.mongodb.net/empresa_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const empresaSchema = new mongoose.Schema({
  empresa: String,
  cnpj: String,
  endereco: String,
  telefone: {
    tipo1: String,
    tipo2: String,
  },
  dataContrato: { type: Date, default: Date.now },
  servicos: [
    {
      descricao: String,
      valor: Number,
    },
  ],
  desconto: Number,
  valorTotal: Number,
});

const Empresa = mongoose.model('Empresa', empresaSchema);

app.use(bodyParser.json());

// Rotas CRUD

// Criar uma nova empresa
app.post('/empresas', async (req, res) => {
  try {
    const novaEmpresa = new Empresa(req.body);
    await novaEmpresa.save();
    novaEmpresa.dataContrato = novaEmpresa.dataContrato.toLocaleDateString('pt-BR');
    res.status(201).json(novaEmpresa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obter todas as empresas
app.get('/empresas', async (req, res) => {
  try {
    const empresas = await Empresa.find();
    res.json(empresas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter uma empresa por ID
app.get('/empresas/:id', async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    res.json(empresa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar uma empresa
app.put('/empresas/:id', async (req, res) => {
  try {
    const empresa = await Empresa.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    res.json(empresa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar uma empresa
app.delete('/empresas/:id', async (req, res) => {
  try {
    const empresa = await Empresa.findByIdAndDelete(req.params.id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    res.json({ message: 'Empresa deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
