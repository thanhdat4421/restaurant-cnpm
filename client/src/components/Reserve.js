import { Container, Box } from '@material-ui/core';
import React from 'react';
import ReserveNavbar from './ReserveNavbar';
import ReserveForm from './ReserveForm';

function Reserve() {
	
  return (
    <div className="reserve">
      <ReserveNavbar/>
      <Container fluid="lg">
        <Box className="reserve-body" sx={{p:3, bgcolor: '#f8f8f8'}}> 
          <Box 
            className="reserve-form-container"
            sx={{pt:10, display: 'flex', justifyContent: 'center', bgcolor: '#fff'}}
          >
            <ReserveForm/>
          </Box>
        </Box>
      </Container>
    </div>
	)
}

export default Reserve
