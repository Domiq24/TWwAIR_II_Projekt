import {useState, useEffect} from 'react';
import { TableCell, Button } from '@mui/material';
import {jwtDecode} from "jwt-decode";

function ParkingSpace({name, setName, spaceDir, spaceState}: {name: string, setName: (name: string) => void, spaceDir: string, spaceState: string}) {
    const [cellStyle, setCellStyle] = useState({border: '4px solid rgba(0, 0, 0, 0)', backgroundColor: '#676767', color: 'white', width: '2.5vw', height: '2.5vw', padding: 0});
    const [user, setUser] = useState({})
    const colSpan = ((spaceDir == 'left' || spaceDir == 'right') ? 2 : 1);
    const rowSpan = ((spaceDir == 'top' || spaceDir == 'bottom') ? 2 : 1);

    const setBorder = () => {
        switch (spaceDir) {
            case 'left':
                return {
                    borderLeftColor: 'white',
                    borderTopColor: 'white',
                    borderBottomColor: 'white'
                };
            case 'right':
                return {
                    borderRightColor: 'white',
                    borderTopColor: 'white',
                    borderBottomColor: 'white'
                };
            case 'top':
                return {
                    borderLeftColor: 'white',
                    borderRightColor: 'white',
                    borderTopColor: 'white'
                };
            case 'bottom':
                return {
                    borderLeftColor: 'white',
                    borderRightColor: 'white',
                    borderBottomColor: 'white'
                };
            default:
                return {};
        }
    }

    const setBackground = () => {
        switch (spaceState) {
            case 'free':
                return { backgroundColor: '#1db81b' };
            case 'occupied':
                return { backgroundColor: '#aa1818' };
            case 'emergency':
                if(user.role != 'user')
                    return { backgroundColor: '#fae600' };
                else
                    return { backgroundColor: '#aa1818' };
            default:
                return {};
        }
    }

    useEffect(() => {
        setUser(jwtDecode(localStorage.getItem('token')));
    }, []);

    useEffect(() => {
        setCellStyle({
            ...cellStyle,
            ...setBorder(),
            ...setBackground()
        })
    }, [spaceState]);

    return (
        <TableCell align="center" colSpan={colSpan} rowSpan={rowSpan} sx={cellStyle}>
            {spaceState === 'free' && user.role === 'user' && name}
            {(spaceState === 'occupied' || user.role != 'user')  && <Button
                size='small'
                variant='text'
                sx={{color: 'white', fontSize: '14px'}}
                onClick={() => setName(name)}
            >{name}</Button>}
        </TableCell>
    )
}

export default ParkingSpace;