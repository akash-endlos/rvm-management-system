import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

const DeleteInventoryBrandModal = ({ isOpen, onClose, onDelete,title }) => {
    return (
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Delete {title}</DialogTitle>
        <DialogContent>
          <Typography>{`Are you sure you want to delete this ${title} ?`}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained">Cancel</Button>
          <Button onClick={onDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  export default DeleteInventoryBrandModal