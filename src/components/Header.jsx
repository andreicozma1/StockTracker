import { AppBar, Divider, IconButton, makeStyles, Menu, MenuItem, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import { MoreVert } from "@material-ui/icons";
import { useState } from "react";
import { def_menu_items } from "./Defaults";


const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1
    },
    menuItemMargin: {
        marginLeft: theme.spacing(2)
    }
}));


function Header({ currentPage, setCurrentPage, pageConfig, menuItems, setMenuItems }) {
    const classes = useStyles();

    const [menuAnchor, setMenuAnchor] = useState(null);

    var pageTitle = "Unknown Page"
    pageTitle = pageConfig.ref[currentPage].title;
    console.log("Header: Page title is " + pageTitle);


    const handlePageChange = (event, newpage) => {
        setCurrentPage(newpage)
        setMenuItems([])
    }
    return (
        <AppBar position='static'>
            <Toolbar>
                <Typography className={classes.title} variant="h6" >
                    {pageTitle}
                </Typography>

                <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} edge="end" color="inherit" aria-controls="popup-menu" aria-haspopup="true">
                    <MoreVert />
                </IconButton>
                <Menu
                    id="popup-menu"
                    keepMounted
                    open={Boolean(menuAnchor)}
                    anchorEl={menuAnchor}
                    onClose={() => setMenuAnchor(null)}>
                    {
                        menuItems.map(function (menu_item) {

                            return <MenuItem onClick={menu_item.callback} key={menu_item.name}>
                                {menu_item.icon}
                                <Typography className={classes.menuItemMargin}>
                                    {menu_item.name}
                                </Typography>
                            </MenuItem>
                        })
                    }
                    <Divider />
                    {
                        def_menu_items.map((def_menu_item) => {
                            return <MenuItem onClick={def_menu_item.callback} key={def_menu_item.name}>
                                {def_menu_item.icon}

                                <Typography className={classes.menuItemMargin}>
                                    {def_menu_item.name}

                                </Typography>
                            </MenuItem>
                        })
                    }

                </Menu>
            </Toolbar>
            <Tabs value={currentPage} onChange={handlePageChange}>
                {
                    Object.keys(pageConfig.ref).map(function (key) {
                        const page = pageConfig.ref[key]

                        return <Tab label={page.title} key={key} />
                    })
                }
            </Tabs>
        </AppBar>

    );
}

export default Header;