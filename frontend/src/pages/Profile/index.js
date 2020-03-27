import React, { useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

import './style.css';

export default function Profile(){
    const history = useHistory();

    const ongName = localStorage.getItem('ongName');
    const ongId = localStorage.getItem('ongId');

    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data);
        })
    },[ongId]);


    async function handleDeleteIncidents(id){
        try {
            await api.delete(`incidents/${id}`,{
                headers: {
                    Authorization: ongId,
                }
            })

            setIncidents(incidents.filter(incident => incident.id !== id));
        } catch (error) {
            alert('Não foi possivel deletar esse caso, tente novamente.');
        }
    }

    function handleLogout(){
        localStorage.clear();

        history.push('/');
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero"/>
                <span>Bem vindo, {ongName}</span>

                <Link className="button" to="/incidents/new">Cadastrr novo caso</Link>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>

            <h1>Casos cadastrados</h1>

            <ul>
                {
                    incidents.map(incidents => (
                        <li key={incidents.id}>
                            <strong>CASOS:</strong>
                            <p>{incidents.title}</p>

                            <strong>DESCRIÇÂO:</strong>
                            <p>{incidents.description}</p>

                            <strong>VALOR:</strong>
                            <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(incidents.value)}</p>

                            <button type="button" onClick={() => handleDeleteIncidents(incidents.id)}>
                                <FiTrash2 size={20} color="#a8a8b3" />
                            </button>

                        </li>
                    ))
                }
            </ul>
        </div>
    );
}