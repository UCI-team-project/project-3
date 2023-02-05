import React from 'react'
import { GET_ALL_STORES } from '../../utils/queries';
import { useQuery } from '@apollo/client';

import SingleItem from '../favoritesList/singleItem'

const TrendingShopsContainer = () => {
  const { loading, data } = useQuery(GET_ALL_STORES);
  const storeList = data?.getAllStores || {};

  if (loading) {
    return <h2>Loading...</h2>
  }

  return (
    <div className=''>
      <h2>Trending Shops</h2>
      {storeList 
        ? <SingleItem storeList={storeList}/>
        : <p>There are no stores to view</p>}
    </div>
  )
}

export default TrendingShopsContainer
