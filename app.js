const express = require('express');
const app = express();

app.use(express.json());

let alunos = [
  { id: 1, nome: 'Ana',   nota1: 8,  nota2: 9 },
  { id: 2, nome: 'Bruno', nota1: 5,  nota2: 6 },
  { id: 3, nome: 'Carla', nota1: 10, nota2: 7 }
];

// Função auxiliar - calcula média
function calcularMedia(aluno) {
  return (aluno.nota1 + aluno.nota2) / 2;
}

// LISTAR todos os alunos (com filtro ?aprovado=true opcional)
app.get('/alunos', (req, res) => {
  const { aprovado } = req.query;

  if (aprovado === 'true') {
    const aprovados = alunos.filter(a => calcularMedia(a) >= 7);
    return res.json(aprovados);
  }

  res.json(alunos);
});

// RANKING de médias (do maior para o menor)

app.get('/alunos/ranking/medias', (req, res) => {
  const ranking = [...alunos].sort((a, b) => calcularMedia(b) - calcularMedia(a));
  res.json(ranking);
});

// BUSCAR aluno por id
app.get('/alunos/:id', (req, res) => {
  const id = Number(req.params.id);
  const aluno = alunos.find(a => a.id === id);

  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }

  res.json(aluno);
});

// CADASTRAR novo aluno
app.post('/alunos', (req, res) => {
  const { id, nome, nota1, nota2 } = req.body;

  if (alunos.find(a => a.id === id)) {
    return res.status(400).json({ erro: 'ID já existe' });
  }

  if (nota1 < 0 || nota1 > 10 || nota2 < 0 || nota2 > 10) {
    return res.status(400).json({ erro: 'Notas devem estar entre 0 e 10' });
  }

  const novoAluno = { id, nome, nota1, nota2 };
  alunos.push(novoAluno);

  res.status(201).json(novoAluno);
});

// ATUALIZAR aluno
app.put('/alunos/:id', (req, res) => {
  const id = Number(req.params.id);
  const aluno = alunos.find(a => a.id === id);

  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }

  const { nome, nota1, nota2 } = req.body;

  if (nota1 < 0 || nota1 > 10 || nota2 < 0 || nota2 > 10) {
    return res.status(400).json({ erro: 'Notas devem estar entre 0 e 10' });
  }

  aluno.nome = nome;
  aluno.nota1 = nota1;
  aluno.nota2 = nota2;

  res.json(aluno);
});

// DELETAR aluno
app.delete('/alunos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = alunos.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }

  alunos.splice(index, 1);
  res.json({ mensagem: 'Aluno removido com sucesso' });
});

app.listen(3000, () => console.log('Servidor rodando na porta: 3000'));