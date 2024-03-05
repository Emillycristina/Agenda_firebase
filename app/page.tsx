"use client";

import React, { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.scss';
import { database } from '../services/firebase';
import { ref, push, onValue, remove, update } from 'firebase/database'


type Contato ={
  chave: string,
  nome: string,
  email: string,
  telefone: string,
  observacoes: string
}

function Home() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [contatos, setContatos] = useState<Contato[]>()
  const [busca, setBusca] = useState<Contato[]>()
  const [estaBuscando, setEstaBuscando]  = useState(false) 
  const [chave, setChave] = useState('')
  const [atualizando, setAtualizando] = useState(false)

  useEffect(() => {
    
    const contatosRef = ref(database, 'contatos');

    // Adicionar um listener para o evento 'value'
    const lista = onValue(contatosRef, (contatos) => {
      const data = Object.entries<Contato>(contatos.val() ?? {}).map(([chave,valor]) => {
        return {
          'chave': chave,
          'nome' : valor.nome,
          'email': valor.email,
          'telefone': valor.telefone,
          'observacoes': valor.observacoes
        }
      });
      setContatos(data)
      
    });

    // Retorne uma função de limpeza para remover o listener quando o componente for desmontado
    return () => lista();
  }, []); 

  
  async function gravar(event: FormEvent) {
    event.preventDefault();

    
    const contatosRef = ref(database, 'contatos');

    const dados = {
      nome,
      telefone,
      email,
      observacoes
    };

    
    await push(contatosRef, dados);
    setNome("")
    setEmail("")
    setTelefone("")
    setObservacoes("")
  }


  function deletar(chave: string){
    const contatoRef = ref(database, `contatos/${chave}`);
    remove(contatoRef);
  }

  function buscar(event: FormEvent){
    const palavra = event.target.value
    if(palavra.length > 0) {
    setEstaBuscando(true)
    const dados = new Array

    contatos?.map(contato => {
      const regra = new RegExp(event.target.value, 'gi')
     if (regra.test(contato.nome)){
      dados.push(contato)
     }
    })
    setBusca(dados)
  } else{
    setEstaBuscando(false)
  }
}

function editarDados(contato: Contato){
  setAtualizando(true)
  setChave(contato.chave)
  setNome(contato.nome)
  setEmail(contato.email)
  setTelefone(contato.telefone)
  setObservacoes(contato.observacoes)
}
  
function atualizarContato() {
  const referencia = ref(database, 'contatos/' + chave);

  const dados = {
    'nome': nome,
    'email': email,
    'telefone': telefone,
    'observacoes': observacoes
  };

  
  if (chave) {
    update(referencia, dados);

    
    setNome("");
    setEmail("");
    setTelefone("");
    setObservacoes("");
    setAtualizando(false);
  } else {
    console.error('Chave não fornecida. A atualização não pode ser realizada.');
  }
}

  return (
    <main className={styles.container}>
      <form >
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="tel" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <textarea placeholder="Observações" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
        {atualizando ?
        <button type="button" onClick={atualizarContato}>Atualizar</button> :
        <button type="button" onClick={gravar}>Salvar</button>
        }
        
      </form>
      <div className={styles.caixacontatos}>
        <input type="text" placeholder="Buscar" onChange={buscar} />
        {estaBuscando ? 
          busca?.map((contato => {
            return (
              <div className={styles.caixaindividual} key={contato.chave}>
                <div className={styles.boxtitulo}>
                  <p className={styles.nometitulo}>{contato.nome}</p>
                  <div>
                    <a>Editar</a>
                    <a onClick={() => deletar(String(contato.chave))}>Excluir</a>
                  </div>
                </div>
                <div className={styles.dados}>
                  <p>{contato.email}</p>
                  <p>{contato.telefone}</p>
                  <p>{contato.observacoes}</p>
                </div>
              </div>
            );
          })
        ) : (
          contatos?.map(contato => {
            return (
              <div className={styles.caixaindividual} key={contato.chave}>
                <div className={styles.boxtitulo}>
                  <p className={styles.nometitulo}>{contato.nome}</p>
                  <div>
                    <a onClick={() => editarDados(contato)}>Editar</a>
                    <a onClick={() => deletar(String(contato.chave))}>Excluir</a>
                  </div>
                </div>
                <div className={styles.dados}>
                  <p>{contato.email}</p>
                  <p>{contato.telefone}</p>
                  <p>{contato.observacoes}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}

export default Home
