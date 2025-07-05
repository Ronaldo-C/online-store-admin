import React, { useState } from 'react'
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Avatar,
  Typography,
  Box,
} from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import StoreIcon from '@mui/icons-material/Store'
import PersonIcon from '@mui/icons-material/Person'
import { useNavigate } from 'react-router'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/atoms/userAtom'
import { UserRole } from '@/types/user'

const drawerWidth = 240

interface MenuChild {
  label: string
  path?: string
}

interface MenuItem {
  label: string
  icon: React.ReactNode
  path?: string
  children?: MenuChild[]
}

const menuList: MenuItem[] = [
  {
    label: '商品管理',
    icon: <StoreIcon />,
    children: [
      { label: '商品管理', path: '/dashboard/products' },
      { label: '商品分类管理', path: '/dashboard/product-categories' },
    ],
  },
  {
    label: '管理员',
    icon: <PersonIcon />,
    path: '/dashboard/admins',
  },
]

const Menu: React.FC = () => {
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({})
  const navigate = useNavigate()
  const userInfo = useAtomValue(userAtom)

  // 根据 userRole 过滤菜单
  const filteredMenuList = menuList.filter(menu => {
    if (menu.label === '管理员') {
      return userInfo?.userRole === UserRole.superAdmin
    }
    return true
  })

  const handleMenuClick = (item: MenuItem, idx: number) => {
    if (item.path) {
      navigate(item.path)
    } else if (item.children && item.children.length > 0) {
      setOpenMenus(prev => ({ ...prev, [idx]: !prev[idx] }))
    }
  }

  const handleChildClick = (child: MenuChild) => {
    if (child.path) {
      navigate(child.path)
    }
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: '#fafbfc',
          borderRight: '1px solid #eee',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 70,
          px: 2,
          borderBottom: '1px solid #e5e6eb',
        }}
        overflow="hidden"
        gap={2}
      >
        <Typography variant="h6" fontWeight={700} color="text.primary" whiteSpace="nowrap">
          管理后台
        </Typography>
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          tabIndex={0}
          aria-label="我的账号"
          onClick={() => navigate('/dashboard/account')}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              navigate('/dashboard/account')
            }
          }}
          overflow="hidden"
          gap={1}
        >
          <Avatar sx={{ width: 24, height: 24 }}>
            <PersonIcon fontSize="small" />
          </Avatar>
          <Typography
            variant="body2"
            color="text.secondary"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {userInfo?.username || userInfo?.name}
          </Typography>
        </Box>
      </Box>
      <List sx={{ flex: 1, py: 0 }}>
        {filteredMenuList.map((menu, idx) => (
          <React.Fragment key={menu.label}>
            <ListItemButton onClick={() => handleMenuClick(menu, idx)}>
              <ListItemIcon>{menu.icon}</ListItemIcon>
              <ListItemText primary={menu.label} />
              {menu.children && menu.children.length > 0 ? (
                openMenus[idx] ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )
              ) : null}
            </ListItemButton>
            {menu.children && menu.children.length > 0 && (
              <Collapse in={openMenus[idx]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {menu.children.map(child => (
                    <ListItemButton
                      key={child.label}
                      sx={{ pl: 4 }}
                      onClick={() => handleChildClick(child)}
                    >
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  )
}

export default Menu
