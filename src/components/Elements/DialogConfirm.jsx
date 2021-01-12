import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import PropTypes from 'prop-types';

export default function DialogConfirm({ open, onClose, onConfirm, title, message, posText, negText, ...props }) {


    return (
        <Dialog open={open} {...props}>
            <DialogTitle>{title ? title : "Are you sure?"}</DialogTitle>
            <DialogContent>
                <Typography type="body">{message ? message : "Are you sure you want to perform this action?"}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{negText ? negText : "Cancel"}</Button>
                <Button autoFocus onClick={() => {
                    onConfirm();
                    onClose()
                }}>
                    {posText ? posText : "Confirm"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

DialogConfirm.propTypes = {
    open: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
}