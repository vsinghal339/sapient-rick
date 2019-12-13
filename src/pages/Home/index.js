import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import { FilterList,CardGrid, Card, Header, FiltersGrid, Filters, SelectedFilters, Search, SortBy } from './styles';

function getClickablePages(actualPage) {
  const offsets = [0, 1, 2, 3, 4];
  return offsets.map(number => parseInt(actualPage, 10) + number);
}

function getPage(direction, actualPage) {
  const nextPage = parseInt(actualPage, 10) + direction;

  return nextPage >= 0 ? nextPage : 1;
}

export default function Home({ match, history }) {
  const [characters, setCharacters] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [species, setSpecies] = useState([]);
  const [gender, setGender] = useState([]);
  const [origin, setOrigin] = useState([]);
  const [allFilters, setAllFilters] = useState([])
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [startSearching, setStartSearching] = useState(false)
  const clickablePages = getClickablePages(match.params.page || 1);
  const page = match.params.page || 1;

  function updateSpecies(data,type){
    let tempState = [];
    let tempFilter = [...allFilters]

    if( type == 'species' && !species.length ){
      tempState = [...species];
      if( species.includes(data) ){
        tempState.splice(tempState.indexOf(data),1)
        tempFilter.splice(tempFilter.indexOf(data),1)
      } else{
        tempState = [...tempState, data]
        tempFilter = [...tempFilter, data]
      }
      setSpecies(tempState);
      setAllFilters(tempFilter);
    }
    else if( type == 'gender' && !gender.length ){
      tempState = [...gender];
      if( gender.includes(data) ){
        tempState.splice(tempState.indexOf(data),1)
        tempFilter.splice(tempFilter.indexOf(data),1)
      } else{
        tempState = [...tempState, data]
        tempFilter = [...tempFilter, data]
      }
      setGender(tempState);
      setAllFilters(tempFilter);
    }

    else if( type == 'origin' && !origin.length ){
      tempState = [...origin];
      if( origin.includes(data) ){
        tempState.splice(tempState.indexOf(data),1)
        tempFilter.allFilters.splice(tempFilter.indexOf(data),1)
      } else{
        tempState = [...tempState, data]
        tempFilter = [...tempFilter, data]
      }
      setOrigin(tempState);
      setAllFilters(tempFilter);
    } 
    
  }

  function updateSearch(value){
    setSearch(value);
  }

  function updateSortBy(value){
    setSortBy(value);
    setCharacters(characters.reverse());
  }
  function updateUrl(){
    let tempUrl = '/?';
    let flag = false;
    if( search ){
      tempUrl += 'name=' + search + '&';
      flag = true;
    }
    if( species ){
      tempUrl += 'species=' + species + '&';
      flag = true;
    }
    if(gender){
      tempUrl += 'gender=' + gender + '&';
      flag = true;
    }
    if( origin ){
      tempUrl += 'origin=' + origin + '&';
      flag = true;
    }
    if( !flag ){
      tempUrl = '/?page=1'
    } 
    return tempUrl
  }

  function startSearchingFn(){
    setStartSearching(!startSearching)
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const apiResponse = await api.get(`${updateUrl()}`);

      setCharacters(apiResponse.data.results);
      setLoading(false);
    }

    loadData();
  }, [species, gender, origin, startSearching]);

  function setDisplayEpisodes(id) {
    setCharacters(
      characters.map(char =>
        char.id === id
          ? { ...char, displayEpisodes: !char.displayEpisodes }
          : char
      )
    );
  }

  return (
    <>
      <Header>
        <header>
          <h1>
            Rick and Morty App
          </h1>
        </header>
      </Header>

      <FiltersGrid>
        <Filters>
        <strong>Species</strong>
        <ul>
          <li onClick={() => updateSpecies('Human','species' )} key={'human'}>
            Human
          </li>
          <li onClick={() => updateSpecies('Mythology','species')} key={'mythology'}>
            Mythology
          </li>
          <li onClick={() => updateSpecies('Other Species','species')} key={'Otherspecies'}>
            Other Species
          </li>
        </ul>
        </Filters>
       
      
        <Filters>
        <strong>Gender</strong>
        <ul>
          <li onClick={() => updateSpecies('Male','gender')} key={'male'}>
            Male
          </li>
          <li onClick={() => updateSpecies('Female','gender')} key={'female'}>
            Female
          </li>
        </ul>
        </Filters>
        

     
        <Filters>
        <strong>Origin</strong>
        <ul>
          <li onClick={() => updateSpecies('Unknown','origin')} key={'unknown'}>
            Unknown
          </li>
          <li onClick={() => updateSpecies('Post-Apocalyptic Earth','origin')} key={'post'}>
            Post-Apocalyptic Earth
          </li>
          <li onClick={() => updateSpecies('Nuptia-4','origin')} key={'nuptia'}>
            Nuptia-4
          </li>
          <li onClick={() => updateSpecies('Other Origin','origin')} key={'other'}>
            Other Origin
          </li>
        </ul>
        </Filters>
        
      </FiltersGrid>

      <SelectedFilters>
          
            <label>Selected Filters</label>
            {allFilters.map(filter => (
              <FilterList>
                {filter}
              </FilterList>    
          ))}
      </SelectedFilters>
      <Search>
            <input type="text" value={search} onChange={e => updateSearch(e.target.value)}></input>
            <button onClick={() => startSearchingFn()}>Search</button>
      </Search>

      <SortBy>
        <select onChange={e => updateSortBy(e.target.value)} value={sortBy}>
         <option value={'asc'}>{'Ascending'}</option>
         <option value={'desc'}>{'Descending'}</option>
        </select>
      </SortBy>

      
      <CardGrid> {loading ? ( <p>Loading...</p> ) : (
          characters.map(char => (
            <Card key={char.id} onClick={() => setDisplayEpisodes(char.id)} displayEpisodes={char.displayEpisodes} >
              <img src={char.image} alt={char.name} />
              <section>
                <header>
                  <h1>
                    <span>{char.id}</span> {char.name}
                  </h1>
                  <h3>
                    {char.species} - {char.status}
                  </h3>
                </header>
              </section>
              <ul>
                <p>Episodes:</p>
                {char.episode.map(epi => epi.split('/episode/')[1]).map(epi => (
                    <li key={char.id + epi}>{epi}</li>
                  ))}
              </ul>
            </Card>
          ))
        )}
      </CardGrid>
    </>
  );
}
