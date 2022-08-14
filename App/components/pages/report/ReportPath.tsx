import { Box, Typography, SxProps } from '@mui/material';

interface ReportPathProps {
    reportPath: string;
}

const ReportPath = ({ reportPath }: ReportPathProps) => {

    const height = "64px";
    const reportPathProperties: SxProps = { pl:2, fontSize: "16px",bgcolor: "black", color: 'white' };

    return (
        <Box sx={{ width: 1, backgroundColor: "#CCCCCC", p: 0, m: 0 }} >
        
                <Typography variant='subtitle1' sx={reportPathProperties} >
                    {reportPath}
                </Typography>        
        </Box>
    )
}

export default ReportPath