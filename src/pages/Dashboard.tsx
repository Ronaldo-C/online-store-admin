import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          仪表板
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            欢迎使用在线商店管理系统
          </Typography>
          <Typography variant="body1" color="textSecondary">
            您已成功登录系统。在这里您可以管理商品、订单、用户等信息。
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 