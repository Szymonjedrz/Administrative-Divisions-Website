import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios"

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'administrativeDivisionName',
    headerName: 'Administrative division name',
    width: 300,
    type: 'string',
    editable: false,
  },
  {
    field: 'countryCodeName',
    headerName: 'Country code',
    width: 200,
    type: 'string',
    editable: false,
  },
  {
    field: 'countryCodeFlag',
    headerName: 'Country flag',
    width: 120,
    editable: false,
    renderCell: (params) => <img src={params.value}/>,
  },
  
];

export default function DataGridReady(props) {

  const [administrativeDivisionsList, setAdministrativeDivisionsList] = useState([]);

  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/kamikazechaser/administrative-divisions-db/master/api/PL.json").then((response)=>{
      var list = response.data.map(administrativeDivisionName => ({administrativeDivisionName}));
      list.map((row, index) => row["id"] = index + 1);
      list.map((row) => row["countryCodeName"] = 'PL');
      list.map((row) => row["countryCodeFlag"] = 'https://flagcdn.com/w40/pl.png');
      setAdministrativeDivisionsList(list)
    });
  }, [])

  const rows = administrativeDivisionsList;

  const countryCodeBasedList = (e) => {
    if (e === null || e.length != 2) {
      return rows;
    }

      axios.get(`https://raw.githubusercontent.com/kamikazechaser/administrative-divisions-db/master/api/${e.toUpperCase()}.json`)
      .then((response)=>{
        var list = response.data.map(administrativeDivisionName => ({administrativeDivisionName}));
        list.map((row, index) => row["id"] = index + 1);
        list.map((row) => row["countryCodeName"] = e.toUpperCase());
        list.map((row) => row["countryCodeFlag"] = `https://flagcdn.com/w40/${e.toLowerCase()}.png`);
        setAdministrativeDivisionsList(list);
      })
      .catch (error => {
        // alert(`${e.toUpperCase()} is a wrong country code. Please enter a new country code.`);
        return rows;
      });

      return administrativeDivisionsList;
  };
  
  return (
    <Box sx={{ height: 700, width: '100%' }}>
      <DataGrid
        rows={countryCodeBasedList(props.searchName)}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 11,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
