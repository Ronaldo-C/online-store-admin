import React from 'react';
import { Box, List, ListItem, ListItemText, Collapse, Typography, ListItemButton } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const menuData = [
  {
    title: '商品管理',
    children: [
      { title: '商品管理' },
      { title: '商品分类管理' },
    ],
  },
  {
    title: '账户管理',
    children: [],
  },
];

const MenuPage: React.FC = () => {
  const [open, setOpen] = React.useState<{ [key: number]: boolean }>({});

  const handleClick = (index: number) => {
    setOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Box bgcolor="#fff" p={4} borderRadius={2} boxShadow={3} minWidth={320}>
        <Typography variant="h5" align="center" gutterBottom>
          菜单导航
        </Typography>
        <List component="nav">
          {menuData.map((menu, idx) => (
            <React.Fragment key={menu.title}>
              {menu.children.length > 0 ? (
                <ListItemButton onClick={() => handleClick(idx)}>
                  <ListItemText primary={menu.title} />
                  {open[idx] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              ) : (
                <ListItem>
                  <ListItemText primary={menu.title} />
                </ListItem>
              )}
              {menu.children.length > 0 && (
                <Collapse in={open[idx]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {menu.children.map((child) => (
                      <ListItem key={child.title} sx={{ pl: 4 }}>
                        <ListItemText primary={child.title} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default MenuPage; 