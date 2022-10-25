import { Box } from '@chakra-ui/react';
import React from 'react'
import { useParams } from 'react-router-dom';

const Dashboard = () => {
  let { subreddit } = useParams();
  return (
    <>
    <div>Dashboard</div>
      <Box> In r/ {subreddit} </Box>
    </>
  )
}

export default Dashboard