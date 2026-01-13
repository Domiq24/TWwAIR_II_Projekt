import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from "@mui/x-charts";
import { Box, Slider, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

interface Data {
    count: number;
    date: Date;
}

interface Event {
    _id: string;
    spaceName: string;
    state: string;
    date: Date;
}

function ParkingUtilChart() {
    const [data, setData] = useState<Data[]>([]);
    const [dataset, setDataset] = useState<Data[]>([]);
    const [range, setRange] = useState('hour');
    const [mode, setMode] = useState('dynamic');
    const [viewDate, setViewDate] = useState(new Date());
    const [sliderScope, setSliderScope] = useState<number>(1);
    const [sliderDisabled, setSliderDisabled] = useState<boolean>(false);
    const [sliderValue, setSliderValue] = useState<number>(0);

    const socket = io("http://localhost:3000");
    socket.on("newEvent", (event: Event) => {
        let addVal = 0;

        if(event.state === "free") addVal = -1;
        else if(event.state === "occupied") addVal = 1;

        if(mode === "dynamic") setData([...data, {count: data[data.length-1].count + addVal, date: event.date}]);
    });

    useEffect(() => {
        let url = "";
        if(mode === "dynamic") url = "http://localhost:3100/events/data";
        else if(mode === "cumulative") url = `http://localhost:3100/events/data/${range}`;

        axios.get(url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => {
            console.log(res.data);
            setData(res.data);
        })
        .catch(err => console.log(err));

        setViewDate(new Date());
    }, [mode, range]);

    useEffect(() => {
        let frame = 0;
        const newDataset: Data[] = [];
        for(const el of data)
        {
            const el_date = new Date(el.date);
            const diff = viewDate.getTime() - el_date.getTime();
            switch (range) {
            case 'hour':
                frame = 60 * 60 * 1000;
                break;
            case 'day':
                frame = 24 * 60 * 60 * 1000;
                break;
            case 'week':
                frame = 7 * 24 * 60 * 60 * 1000;
                break;
            case 'month':
                frame = 31 * 24 * 60 * 60 * 1000;
                break;
            case 'year':
                frame = 364 * 24 * 60 * 60 * 1000;
                break;
            }
            if(diff <= frame && diff > 0)
                newDataset.push({count: el.count, date: el_date});
        }

        if(mode === "cumulative" && newDataset.length > 0) {
            switch (range) {
            case "hour":
                for(let i = 60; i >= 0; i -= 5) {
                    const checkDate = new Date(viewDate.getTime() - i * 60 * 1000);
                    if(!newDataset.find(d => d.date >= checkDate && d.date < new Date(checkDate.getTime() - 5 * 60 * 1000) && d.date.getHours() === checkDate.getHours()))
                        newDataset.push({ count: 0, date: checkDate });
                }
                break;
            case "day":
                for(let i = 24; i >= 0; i--) {
                    const checkDate = new Date(viewDate.getTime() - i * 60 * 60 * 1000);
                    if(!newDataset.find(d => d.date.getHours() === checkDate.getHours() && d.date.getDay() === checkDate.getDay()))
                        newDataset.push({ count: 0, date: checkDate });
                }
                break;
            case "week":
                for(let i = 7; i >= 0; i--) {
                    const checkDate = new Date(viewDate.getTime() - i * 24 * 60 * 60 * 1000);
                    if(!newDataset.find(d => d.date.getDay() === checkDate.getDay() && d.date.getDate() === checkDate.getDate()))
                        newDataset.push({ count: 0, date: checkDate });
                }
                break;
            case "month":
                for(let i = 31; i >= 0; i--) {
                    const checkDate = new Date(viewDate.getTime() - i * 24 * 60 * 60 * 1000);
                    if(!newDataset.find(d => d.date.getDate() === checkDate.getDate() && d.date.getMonth() === checkDate.getMonth()))
                        newDataset.push({ count: 0, date: checkDate });
                }
                break;
            case "year":
                for(let i = 364; i >= 0; i--) {
                    const checkDate = new Date(viewDate.getTime() - i * 24 * 60 * 60 * 1000);
                    if(!newDataset.find(d => d.date.getMonth() === checkDate.getMonth() && d.date.getFullYear() === checkDate.getFullYear()))
                        newDataset.push({ count: 0, date: checkDate });
                }
                break;
            }
        }

        newDataset.sort((a, b) => a.date.getTime() - b.date.getTime());
        setDataset(newDataset);
    }, [data, range, viewDate]);

    useEffect(() => {
        setSliderValue(0)
        switch (range) {
            case 'hour':
                setSliderDisabled(false);
                setSliderScope(24);
                break;
            case 'day':
                setSliderDisabled(false);
                setSliderScope(7);
                break;
            case 'week':
                setSliderDisabled(false);
                setSliderScope(5);
                break;
            case 'month':
                setSliderDisabled(false);
                setSliderScope(12);
                break;
            case 'year':
                console.log(data);
                const diff = new Date(data[data.length-1].date).getFullYear() - new Date(data[0].date).getFullYear();
                setSliderDisabled(diff > 0);
                setSliderScope(diff > 0 ? diff : 1);
                break;
        }
    }, [range]);

    const dynamicFormatter = (date: Date) => {
        switch(range) {
        case 'hour':
            return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} ${date.getSeconds().toString().padStart(2, '0')}s`;
        case 'day':
            return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        case 'week':
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            return `${days[date.getDay()]} ${date.getHours()}:00`;
        case 'month':
            return `${date.getDate()}.${(date.getMonth()+1).toString().padStart(2, '0')} ${date.getHours()}:00`;
        case 'year':
            return `${date.getDate()}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear().toString().padStart(4, '0')}`;
        }
    }

    const cumulativeFormatter = (date: Date) => {
        switch(range) {
            case 'hour':
                return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            case 'day':
                return `${date.getHours()}:00`;
            case 'week':
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                return `${days[date.getDay()]}`;
            case 'month':
                return `${date.getDate()}.${(date.getMonth()+1).toString().padStart(2, '0')}`;
            case 'year':
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return `${months[date.getMonth()]} ${date.getFullYear().toString().padStart(4, '0')}`;
        }
    }

    const handleChange = (event, newValue) => {
        setSliderValue(newValue);
        let time = 0;
        switch (range) {
        case 'hour':
             time = newValue * 60 * 60 * 1000;
             break;
        case 'day':
            time = newValue * 24 * 60 * 60 * 1000;
            break;
        case 'week':
            time = newValue * 7 * 24 * 60 * 60 * 1000;
            break;
        case 'month':
            time = newValue * 30 * 24 * 60 * 60 * 1000;
            break;
        case 'year':
            time = newValue * 364 * 24 * 60 * 60 * 1000;
            break;
        }
        setViewDate(new Date(Date.now() + time));
    }

    const graphStyle = {
        [`.${axisClasses.root}`]: {
            [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                stroke: "#ffffff",
                strokeWidth: 2,
            },
            [`.${axisClasses.tickLabel}`]: {
                fill: "#ffffff",
            }
        }
    }

    return (
        <>
            <Box sx={{textAlign: 'left', paddingLeft: '40px'}}>
                <FormControl variant="standard" size="small">
                    <InputLabel id='parking_util_scope_label' sx={{color: 'white'}} >Scope</InputLabel>
                    <Select
                        labelId="parking_util_scope_label"
                        value={range}
                        variant='standard'
                        onChange={(e) => setRange(e.target.value)}
                        sx={{color: 'white', '& .MuiSelect-icon': {color: 'white'}}}
                    >
                        <MenuItem value="hour" >Hour</MenuItem>
                        <MenuItem value="day" >Day</MenuItem>
                        <MenuItem value="week" >Week</MenuItem>
                        <MenuItem value="month" >Month</MenuItem>
                        <MenuItem value="year" >Year</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="standard" size="small" sx={{marginLeft: '20px', flex: 1}}>
                    <InputLabel id='parking_util_mode_label' sx={{color: 'white'}} >Mode</InputLabel>
                    <Select
                        labelId="parking_util_mode_label"
                        value={mode}
                        variant='standard'
                        onChange={(e) => setMode(e.target.value)}
                        sx={{color: 'white', '& .MuiSelect-icon': {color: 'white'}}}
                    >
                        <MenuItem value="dynamic" >Dynamic</MenuItem>
                        <MenuItem value="cumulative" >Cumulative</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            {mode == "dynamic" && <LineChart
                xAxis={[{
                    dataKey: "date",
                    scaleType: "time",
                    valueFormatter: dynamicFormatter
                }]}
                yAxis={[{
                    min: 0,
                }]}
                dataset={dataset}
                series={[{
                    dataKey: "count",
                    curve: "linear",
                    showMark: false
                }]}
                height={600}
                sx={graphStyle}
            />}
            {mode == "cumulative" && <BarChart
                xAxis={[{
                    dataKey: "date",
                    valueFormatter: cumulativeFormatter
                }]}
                dataset={dataset}
                series={[{
                    dataKey: "count"
                }]}
                height={600}
                sx={graphStyle}
            />}
            <Box>
                {`${viewDate.getHours()}:${viewDate.getMinutes().toString().padStart(2, '0')} ${viewDate.getDate()}.${(viewDate.getMonth()+1).toString().padStart(2, '0')}.${viewDate.getFullYear()}`}
                <Slider
                    value={sliderValue}
                    onChange={handleChange}
                    disabled={sliderDisabled}
                    min={-sliderScope}
                    max={0}
                    step={1}
                    marks
                />
            </Box>
        </>
    )
}

export default ParkingUtilChart;