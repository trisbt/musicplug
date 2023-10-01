
import * as React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Alert } from '@mui/material';
import { AlertTitle } from '@mui/material';
import { Container } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { blueGrey } from '@mui/material/colors';
import { indigo } from '@mui/material/colors';
// import SearchByIdOrArtistSong from '../utils/SearchByIdOrArtistSong';

interface Row {
  song: string;
  artist: string;
  album: string;
  key: string;
  tempo: number;
  id: string;
};

interface SelectedRow {
  name: string;
  id: string;
  artist: string;
};

type CreateDataType = (song: string, artist: string, album: string, key: string, tempo: number, id: string) => Row;

interface EnhancedTableHeadProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Row) => void;
  order: 'asc' | 'desc';
  orderBy: keyof Row;
  rowCount: number;
};

interface EnhancedTableProps {
  favorites: any[];
  initialRenderDone: boolean;
  activeSlice?: string | null;
  username: string;
  setFavDeleteRender: React.Dispatch<React.SetStateAction<boolean>>;
  favDeleteRender: boolean;
};

interface HeadCell {
  id: keyof Row;
  numeric: boolean;
  disablePadding: boolean;
  label: string;
};

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: indigo[300],
    color: theme.palette.common.white,
    padding: "8px 10px",

  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "8px 10px",
  },
  "&.column-key": {
    width: "5px",
  },
  "&.column-tempo": {
    width: "5px",
  },
  "&.column-song": {
    width: "50px",
  },
  "&.column-artist": {
    width: "50px",
  },
  "&.column-album": {
    width: "50px",
  },
}));

const createData: CreateDataType = (song, artist, album, key, tempo, id) => {
  return {
    song, artist, album, key, tempo, id
  };
}

const descendingComparator = (a: Row, b: Row, orderBy: keyof Row): number => {
  if (typeof a[orderBy] === 'string' && typeof b[orderBy] === 'string') {
    const lowerA = (a[orderBy] as string).toLowerCase();
    const lowerB = (b[orderBy] as string).toLowerCase();

    if (lowerB < lowerA) {
      return -1;
    }
    if (lowerB > lowerA) {
      return 1;
    }
    return 0;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const getComparator = (order: 'asc' | 'desc', orderBy: keyof Row) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const stableSort = (array: Row[], comparator: (a: Row, b: Row) => number): Row[] => {
  const stabilizedThis = array.map((el, index) => [el, index] as [Row, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells: HeadCell[] = [
  {
    id: 'key',
    numeric: false,
    disablePadding: false,
    label: 'Key',
  },
  {
    id: 'tempo',
    numeric: true,
    disablePadding: false,
    label: 'BPM',
  },
  {
    id: 'song',
    numeric: false,
    disablePadding: true,
    label: 'Song',
  },
  {
    id: 'artist',
    numeric: false,
    disablePadding: false,
    label: 'Artist',
  },
  {
    id: 'album',
    numeric: false,
    disablePadding: false,
    label: 'Album',
  },

];

const EnhancedTableHead: React.FC<EnhancedTableHeadProps> = (props) => {
  const { order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <CustomTableCell
            key={headCell.id}
            className={`column-${headCell.id}`}
            align={'left'}
            // width='20'
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            isFirstColumn={index === 0}
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
          </CustomTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf<'asc' | 'desc'>(['asc', 'desc']).isRequired,
  orderBy: PropTypes.oneOf<keyof Row>(['song', 'artist', 'album', 'key', 'tempo', 'id']).isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTable: React.FC<EnhancedTableProps> = ({ favorites, initialRenderDone, activeSlice, username, setFavDeleteRender, favDeleteRender }) => {
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const [orderBy, setOrderBy] = useState<keyof Row | null>(null);
  const [selected, setSelected] = useState<SelectedRow[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const navigate = useNavigate();

  let rows: Row[] = favorites.map(favorite => createData(
    favorite.song,
    favorite.artist,
    favorite.album,
    favorite.key,
    favorite.tempo,
    favorite.id
  ));
  if (order === 'desc' && orderBy === null) {
    rows = rows.reverse();
  }

  if (activeSlice) {
    rows = rows.filter(row => row.key === activeSlice);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, name, id, artist) => {
    const selectedIndex = selected.findIndex(item => item.name === name);
    let newSelected: SelectedRow[] = [];
    if (selectedIndex === -1) {
      newSelected = [{ name: name, artist: artist, id: id }];
    }
    setSelected(newSelected);
    navigate(`/${newSelected[0].name}/${newSelected[0].artist}/${newSelected[0].id}`);

  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage === -1 ? rows.length : newRowsPerPage);
    setPage(0);
  };


  const isSelected = (name, artist, id) => selected.some(item => item.name === name && item.id === id && item.artist === artist);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [initialRenderDone, order, orderBy, page, rowsPerPage, rows],
  );

  return (
    <Container maxWidth="xl" sx={{
      "@media (max-width: 900px)": {
        display: 'flex',
        width: '100vw',

      }
    }}>
      <Box sx={{
        width: '100%',

      }}>
        <Paper variant="outlined" square sx={{
          width: '100%',
          mb: 2,
          border: "1px solid black",

        }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750, tableLayout: 'fixed' }}
              aria-labelledby="tableTitle"
              size='medium'
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.song, row.id, row.artist);

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.song, row.id, row.artist)}
                      tabIndex={-1}
                      key={row.song}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <CustomTableCell className="column-key" align="left">{row.key}</CustomTableCell>
                      <CustomTableCell className="column-tempo" align="left">{row.tempo}</CustomTableCell>
                      <CustomTableCell className="column-song" align="left">{row.song}</CustomTableCell>
                      <CustomTableCell className="column-artist" align="left">{row.artist}</CustomTableCell>
                      <CustomTableCell className="column-album" align="left">{row.album}</CustomTableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (30) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[50, 100, { value: -1, label: 'All' }]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Container>
  );
}

export default EnhancedTable;