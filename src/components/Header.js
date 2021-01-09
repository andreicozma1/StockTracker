import { AppBar, IconButton, makeStyles, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import {useState} from 'react'
import {MoreVert} from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1
    }
}));

function Header(props) {
    const classes = useStyles();

    const [menuAnchor, setMenuAnchor] = useState(null);

    var pageTitle = "Unknown Page"
    if(props.currentPage)
        pageTitle = props.currentPage;
    console.log("Header: Page title is " + pageTitle);

    const handleMenuItemClick = (newPage) => {
        props.setCurrentPage(newPage)
        setMenuAnchor(null);
    }

    return (
        <AppBar position='static'>
            <Toolbar>
                <Typography className={classes.title} variant="h6" >
                    {pageTitle}
                </Typography>

                <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} edge="end" color="inherit" aria-controls="popup-menu" aria-haspopup="true">
                    <MoreVert/>
                </IconButton>
                <Menu
                    id="popup-menu"
                    keepMounted
                    open={Boolean(menuAnchor)}
                    anchorEl={menuAnchor}
                    onClose={() => setMenuAnchor(null)}
                    >
                    {
                        Object.keys(props.pageConfig).map(function(key){
                            return <MenuItem onClick={() => handleMenuItemClick(key)} key={key}>{key}</MenuItem>
                        })
                    }

                </Menu>
            </Toolbar>
        </AppBar>

    );
}

export default Header;