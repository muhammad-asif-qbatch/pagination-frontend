import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import { styled, alpha } from '@mui/material/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import EditIcon from '@mui/icons-material/Edit';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import DoneIcon from '@mui/icons-material/Done';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { getProducts, addToSearchingText, updateProducts, setThePagination, setTheFilter} from '../reducer/product';
import {useSelector, useDispatch} from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';

const ariaLabel = { 'aria-label': 'description' };

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '25ch',
      '&:focus': {
        width: '25ch',
      },
    },
  },
}));

//Hello World

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'fat',
    numeric: true,
    disablePadding: false,
    label: 'ASIN',
  },
  {
    id: 'carbs',
    numeric: true,
    disablePadding: false,
    label: 'Origin',
  },
  {
    id: 'protein',
    numeric: true,
    disablePadding: false,
    label: 'Identification Keys',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, changeFunction } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Products
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Typography>
          <Search onChange={(e) => changeFunction(e)}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search by ASIN or Name"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const { productList: rows, productCount} = useSelector(state => state.product);
  const {searchingText} = useSelector(state => state.product);
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchedText, setSearchedText] = React.useState(searchingText);
  const [clicked, setClicked] = React.useState("");
  const [asin, setAsin] = React.useState('');
  const [flag, setFlag] = React.useState('');
  const [filter, setFilter] = React.useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    const pagination = {
      page: page,
      rowsPerPage: rowsPerPage
    }
    dispatch(setThePagination(pagination));
    //dispatch(getProducts());
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    const pagination = {
      page: page,
      rowsPerPage: rowsPerPage
    }
    dispatch(setThePagination(pagination));
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  function isBlank(str) {
      return (!str || /^\s*$/.test(str));
  }
  const handleSearchedTextChange = event => {
    const text = event.target.value;
    const isBlankOrNot = isBlank(text);
    if(!isBlankOrNot){
      const filters = {
        field:'keyword',
        value: text
      }
      // setSearchedText(text);
      setFilter(filters);
      setPage(0);
      dispatch(setTheFilter(filters));
      dispatch(addToSearchingText(text));
      dispatch(getProducts(filters));
    }
    else{
      const filters = {
        field:'keyword',
        value: text
      }
      dispatch(getProducts(filters));
      dispatch(addToSearchingText(text));
    }
    
  }
  const handleEdit = (e) => {
    setClicked(e);
    //setRowIndex(e);
  }
  const handleDone = (index) => {
    setClicked('');
    console.log('Asin: ', asin);
    const data = {
      _id : index,
      asin
    }
    dispatch(updateProducts(data));
    setFlag('Okay');
  }
  useEffect(() => {
      const pagination = {
        page: page,
        rowsPerPage: rowsPerPage
      }
      dispatch(setThePagination(pagination));
      const filter = {
        field: '',
        value: ''
      }
      dispatch(getProducts(filter));
      setFlag('');
      console.log('Hello from useEffect');
  }, [dispatch, rowsPerPage, flag, page])
  return (
    <Grid container>
    <Grid item xs={2}>
        Hello World
    </Grid>
    <Grid item xs={10}>
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} textValue={searchedText} changeFunction={handleSearchedTextChange}/>
        <TableContainer style={{height: '90vh'}}>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell> 
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">
                      {clicked===row._id?
                        <>
                              <IconButton onClick={() => handleDone(row._id)}>
                                <DoneIcon></DoneIcon>
                              </IconButton>
                              <Input defaultValue={row.asin} id={`asin-${index}`} inputProps={ariaLabel} onChange={(e) => setAsin(e.target.value)}/>
                           </>
                      :<>
                              <IconButton onClick={() => handleEdit(row._id)}>
                                <EditIcon></EditIcon>
                              </IconButton>
                              {/* <TextField id="outlined-basic" value={row.asin} variant="outlined" /> */}
                              {row.asin}
                            </>}
                       {/* {
                         !clicked && (
                           <>
                              <IconButton >
                                <EditIcon onClick={() => handleEdit(row._id)}></EditIcon>
                              </IconButton>
                              <TextField id="outlined-basic" value={row.asin} variant="outlined" />
                            </>
                         )
                       }
                       {
                         (clicked && rowIndex == row._id) && (
                           <>
                              <IconButton>
                                <DoneIcon></DoneIcon>
                              </IconButton>
                              <Input defaultValue={row.asin} id={`asin-${index}`} inputProps={ariaLabel} />
                           </>
                         )
                         
                       } */}
                         
                      </TableCell>
                      <TableCell align="right"><Input defaultValue={row.origin} inputProps={ariaLabel} /></TableCell>
                      <TableCell align="right" size="medium">{row._id}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={productCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
    </Grid>
    </Grid>
  );
}
