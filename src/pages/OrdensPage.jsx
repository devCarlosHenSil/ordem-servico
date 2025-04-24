import React, { useEffect, useState } from 'react';
import { getOrdens, criarOrdem } from '../services/ordensService';

export default function OrdensPage() {
  const [ordens, setOrdens] = useState([]);
  const [novaOrdem, setNovaOrdem] = useState({ cliente: '', descricao: '' });

  useEffect(() => {
    async function carregarOrdens() {
      const data = await getOrdens();
      setOrdens(data);
    }
    carregarOrdens();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await criarOrdem(novaOrdem);
    const data = await getOrdens();
    setOrdens(data);
    setNovaOrdem({ cliente: '', descricao: '' });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Ordens de Serviço</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="border p-2 mr-2"
          type="text"
          placeholder="Cliente"
          value={novaOrdem.cliente}
          onChange={(e) => setNovaOrdem({ ...novaOrdem, cliente: e.target.value })}
          required
        />
        <input
          className="border p-2 mr-2"
          type="text"
          placeholder="Descrição"
          value={novaOrdem.descricao}
          onChange={(e) => setNovaOrdem({ ...novaOrdem, descricao: e.target.value })}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Criar</button>
      </form>

      <ul>
        {ordens.map((ordem, index) => (
          <li key={index} className="mb-2 border-b py-1">
            <strong>{ordem.cliente}</strong>: {ordem.descricao}
          </li>
        ))}
      </ul>
    </div>
  );
}
