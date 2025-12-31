import { Paper, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material';
import ParkingSpace from "./ParkingSpace.tsx";
import ImportExportIcon from '@mui/icons-material/ImportExport';

function ParkingMap({spaces, setName}: {spaces: {[name: string]: string}, setName: (name: string) => void}) {
    return (
        <Paper square variant='outlined' sx={{width: '70%', borderColor: '#171717', padding: '60px', backgroundColor: '#373737'}}>
            <TableContainer>
                <Table>
                    <TableBody >
                        <TableRow>
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <ParkingSpace name="B01" spaceDir="top" spaceState={spaces["B01"]} setName={setName} />
                            <ParkingSpace name="B02" spaceDir="top" spaceState={spaces["B02"]} setName={setName} />
                            <ParkingSpace name="B03" spaceDir="top" spaceState={spaces["B03"]} setName={setName} />
                            <ParkingSpace name="B04" spaceDir="top" spaceState={spaces["B04"]} setName={setName} />
                            <ParkingSpace name="B05" spaceDir="top" spaceState={spaces["B05"]} setName={setName} />
                            <ParkingSpace name="B06" spaceDir="top" spaceState={spaces["B06"]} setName={setName} />
                            <ParkingSpace name="B07" spaceDir="top" spaceState={spaces["B07"]} setName={setName} />
                            <ParkingSpace name="B08" spaceDir="top" spaceState={spaces["B08"]} setName={setName} />
                            <TableCell sx={{borderBottom: 'none', textAlign: 'center'}}><ImportExportIcon sx={{color: 'white', fontSize: '3rem'}} /></TableCell>
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                        </TableRow>
                        <TableRow>
                            <ParkingSpace name="A01" spaceDir="left" spaceState={spaces["A01"]} setName={setName} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                        </TableRow>
                        <TableRow>
                            <ParkingSpace name="A02" spaceDir="left" spaceState={spaces["A02"]} setName={setName} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <ParkingSpace name="F01" spaceDir="right" spaceState={spaces["F01"]} setName={setName} />
                        </TableRow>
                        <TableRow>
                            <ParkingSpace name="A03" spaceDir="left" spaceState={spaces["A03"]} setName={setName} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <ParkingSpace name="C01" spaceDir="bottom" spaceState={spaces["C01"]} setName={setName} />
                            <ParkingSpace name="C02" spaceDir="bottom" spaceState={spaces["C02"]} setName={setName} />
                            <ParkingSpace name="C03" spaceDir="bottom" spaceState={spaces["C03"]} setName={setName} />
                            <ParkingSpace name="C04" spaceDir="bottom" spaceState={spaces["C04"]} setName={setName} />
                            <ParkingSpace name="C05" spaceDir="bottom" spaceState={spaces["C05"]} setName={setName} />
                            <ParkingSpace name="C06" spaceDir="bottom" spaceState={spaces["C06"]} setName={setName} />
                            <ParkingSpace name="C07" spaceDir="bottom" spaceState={spaces["C07"]} setName={setName} />
                            <ParkingSpace name="C08" spaceDir="bottom" spaceState={spaces["C08"]} setName={setName} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <ParkingSpace name="F02" spaceDir="right" spaceState={spaces["F02"]} setName={setName} />
                        </TableRow>
                        <TableRow>
                            <ParkingSpace name="A04" spaceDir="left" spaceState={spaces["A04"]} setName={setName} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <ParkingSpace name="F03" spaceDir="right" spaceState={spaces["F03"]} setName={setName} />
                        </TableRow>
                        <TableRow>
                            <ParkingSpace name="A05" spaceDir="left" spaceState={spaces["A05"]} setName={setName} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <ParkingSpace name="D01" spaceDir="top" spaceState={spaces["D01"]} setName={setName} />
                            <ParkingSpace name="D02" spaceDir="top" spaceState={spaces["D02"]} setName={setName} />
                            <ParkingSpace name="D03" spaceDir="top" spaceState={spaces["D03"]} setName={setName} />
                            <ParkingSpace name="D04" spaceDir="top" spaceState={spaces["D04"]} setName={setName} />
                            <ParkingSpace name="D05" spaceDir="top" spaceState={spaces["D05"]} setName={setName} />
                            <ParkingSpace name="D06" spaceDir="top" spaceState={spaces["D06"]} setName={setName} />
                            <ParkingSpace name="D07" spaceDir="top" spaceState={spaces["D07"]} setName={setName} />
                            <ParkingSpace name="D08" spaceDir="top" spaceState={spaces["D08"]} setName={setName} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <ParkingSpace name="F04" spaceDir="right" spaceState={spaces["F04"]} setName={setName} />
                        </TableRow>
                        <TableRow>
                            <ParkingSpace name="A06" spaceDir="left" spaceState={spaces["A06"]} setName={setName} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <ParkingSpace name="F05" spaceDir="right" spaceState={spaces["F05"]} setName={setName} />
                        </TableRow>
                        <TableRow>
                            <ParkingSpace name="A07" spaceDir="left" spaceState={spaces["A07"]} setName={setName} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <ParkingSpace name="F06" spaceDir="right" spaceState={spaces["F06"]} setName={setName} />
                        </TableRow>
                        <TableRow>
                            <ParkingSpace name="A08" spaceDir="left" spaceState={spaces["A08"]} setName={setName} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <ParkingSpace name="E01" spaceDir="bottom" spaceState={spaces["E01"]} setName={setName} />
                            <ParkingSpace name="E02" spaceDir="bottom" spaceState={spaces["E02"]} setName={setName} />
                            <ParkingSpace name="E03" spaceDir="bottom" spaceState={spaces["E03"]} setName={setName} />
                            <ParkingSpace name="E04" spaceDir="bottom" spaceState={spaces["E04"]} setName={setName} />
                            <ParkingSpace name="E05" spaceDir="bottom" spaceState={spaces["E05"]} setName={setName} />
                            <ParkingSpace name="E06" spaceDir="bottom" spaceState={spaces["E06"]} setName={setName} />
                            <ParkingSpace name="E07" spaceDir="bottom" spaceState={spaces["E07"]} setName={setName} />
                            <ParkingSpace name="E08" spaceDir="bottom" spaceState={spaces["E08"]} setName={setName} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                            <TableCell sx={{borderBottom: 'none'}} />
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default ParkingMap;