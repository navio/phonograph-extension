import React, { useEffect, useState } from 'react';
import Card from './Card';
import styled from 'styled-components';

const Container = styled.div`
    display:flex;
    flex-direction: row;
`;

export default () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch('https://odd-lake-0e8b.navio.workers.dev')
        .then( response => response.json())
        .then( response => response['podcasts'])
        .then(setData);
    },[]);
    
    return <Container>{data && data.map(podcast => <Card title={podcast.title} image={podcast.thumbnail} description={podcast.description} /> )}</Container>
}