import { Box, Typography, SxProps } from '@mui/material';

interface ReportPathProps {
    reportPath: string;
}

const ReportPath = ({ reportPath }: ReportPathProps) => {

    const reportPathProperties: SxProps = { pl:2, py:1, fontSize: "20px",bgcolor: "black", color: 'white', minHeight:"42px" };

    return (
        <Box sx={{ width: 1, backgroundColor: "#CCCCCC", p: 0, m: 0 }} >        
                <Typography variant='h2' sx={reportPathProperties} >
                    {reportPath}
                </Typography>        
        </Box>
    )
}

export default ReportPath