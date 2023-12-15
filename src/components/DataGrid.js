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
  // { field: 'id', headerName: 'ID', width: 90 },
  // {
  //   field: 'firstName',
  //   headerName: 'First name',
  //   width: 200,
  //   editable: true,
  // },
  // {
  //   field: 'lastName',
  //   headerName: 'Last name',
  //   width: 200,
  //   editable: true,
  // },
  // {
  //   field: 'age',
  //   headerName: 'Age',
  //   type: 'number',
  //   width: 200,
  //   editable: true,
  // },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 200,
  //   valueGetter: (params) =>
  //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  // },
];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 100 },
//   { id: 6, lastName: 'Melisandre', firstName: 'Melisa', age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
//   { id: 10, lastName: 'Vader', firstName: 'Darth', age: 60 },
//   { id: 11, lastName: 'Kenobi', firstName: 'Obi-Wan', age: 80 },
// ];

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

  const filterList = (e) => {
    if (e === null) {
      return rows;
    }
    const updatedList = rows.filter((item) => {
      return (
        item.administrativeDivisionName.toLowerCase().search(e) !== -1
        // item.lastName.toLowerCase().search(e) !== -1 ||
        // item.firstName.toLowerCase().search(e) !== -1
      );
    });
    return updatedList;
  };

  const countryCodeBasedList = (e) => {
    if (e === null || e.length != 2) {
      return rows;
    }
    // if (e.length != 2) {
    //   return filterList(e);
    // }

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
        //rows={filterList(props.searchName)}
        //rows={rows}
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
