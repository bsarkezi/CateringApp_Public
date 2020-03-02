﻿import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ListItems from './ListItems';
import AddIcon from '@material-ui/icons/Add';
import AddCateringDialog from './AddCateringDialog';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    biggerText: {
        fontSize:"1.5em",
    }
}));


export default function Caterings() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [users, setUsers] = useState(null);
    const [caterings, setCaterings] = useState(null);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleDialogClose = () =>{
        setDialogOpen(false);
    }

    const handleDialogOpen = () => {
        setDialogOpen(true);
    }

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const fetchUsers = async () => {
        const apiCall = await fetch("/api/catering/users");
        const users = await apiCall.json();
        setUsers(users);
    }

    useEffect(() => {
        fetchUsers();
        console.log(users);    
    },[]);


    

    return (
        <main className={classes.content}> 
            <div className={classes.appBarSpacer} />

            <Container className={classes.container} maxWidth="xl">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <div className={classes.appBarSpacer}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={handleDialogOpen}
                                className={classes.biggerText}
                            >
                                Dodaj
                            </Button>
                        </div>
                        <Paper className={fixedHeightPaper}>
                            <Grid item lg={12}>
                                <h4>Popis Cateringa</h4>
                            </Grid>
                        </Paper>
                    </Grid>
                    
                </Grid>
                
            </Container>
            <AddCateringDialog open={dialogOpen} handleClose={handleDialogClose} />
        </main>    
    )
}