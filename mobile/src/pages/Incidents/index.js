import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';

import logoImg from '../../assets/logo.png';
import api from '../../services/api';

import style from './styles.js'
import styles from './styles.js';

export default function Incidents(){
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    function navigateToDetail(incident){
        navigation.navigate('Detail', { incident });
    }

    async function loadIncidents(){
        if(loading){
            return;
        }

        if (total > 0 && incidents.length === total){
            return;
        }

        setLoading(true);

        const response = await api.get('incidents',{
            params: { page }
        });

        setIncidents([...incidents, ...response.data]);
        setTotal(response.headers['x-total-count']);
        setPage(page + 1);
        setLoading(false);
    }

    useEffect(() => {
        loadIncidents();
    }, [])

    return (
        <View style={style.container}>
            <View style={style.header}>
                <Image source={logoImg} />
                <Text style={style.headerText}>
                    Total de <Text style={style.headerTextBold}>{total} casos</Text>.
                </Text>
            </View>

            <Text style={style.title}>Bem-vindo!</Text>
            <Text style={style.description}>Escolha um dos casos abaixo e salve o dia.</Text>
            
            <FlatList 
                data={incidents}
                keyExtractor={incident => String(incident.id)}
                showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                style={styles.incidentList}
                renderItem={({ item: incident }) => (
                    <View text={styles.Incidents}>
                    <View style={styles.Incidents}>
                        <Text style={styles.IncidentProperty}>ONG:</Text>
                        <Text style={styles.IncidentValue}>{incident.name}</Text>

                        <Text style={styles.IncidentProperty}>CASO:</Text>
                        <Text style={styles.IncidentValue}>{incident.description}</Text>

                        <Text style={styles.IncidentProperty}>VALOR:</Text>
                        <Text style={styles.IncidentValue}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(incident.value)}</Text>
                    
                        <TouchableOpacity 
                            style={styles.detailsButton} 
                            onPress={() => navigateToDetail(incident)}>
                            
                            <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={16} color="#E02041"/>
                        </TouchableOpacity>
                    </View>                
                </View>
                )}
            />

        </View>

        
    );
}