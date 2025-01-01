import "./InputSlider.css";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { ChangeEvent, useState } from "react";
import { Grid } from "@mui/material";
import PaidOutlined from "@mui/icons-material/PaidOutlined";

//MUI component, for documentation:
// https://mui.com/material-ui/react-slider/
const Input = styled(MuiInput)`
  width: 42px;
`;

interface DataFormParent {
    initialMaxValue: number;
    savedValue: number;
    setSliderValue: (updated: number) => void
}



export default function InputSlider(parentData: DataFormParent) {
    let slider = parentData.savedValue > 0 ? parentData.savedValue : parentData.initialMaxValue;
    const [value, setValue] = useState(slider);

    //slider
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        parentData.setSliderValue(newValue as number);
        setValue(newValue as number)
    };

    //input buttons
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        parentData.setSliderValue(event.target.value === '' ? 0 : Number(event.target.value));
        setValue(event.target.value === '' ? 0 : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > parentData.initialMaxValue) {
            setValue(parentData.savedValue);
        }
    };

    return (
        <Box sx={{ width: 250 }}>
            <Typography id="input-slider" gutterBottom>
                Show the coupons up to the price:
            </Typography>
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Grid item>
                    <PaidOutlined />
                </Grid>
                <Grid item xs>
                    <Slider
                        value={typeof value === 'number' ? value : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        max={parentData.initialMaxValue}
                        min={0}
                    />
                </Grid>
                <Grid item>
                    <Input
                        value={value}
                        size="small"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 10,
                            min: 0,
                            max: parentData.initialMaxValue,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
