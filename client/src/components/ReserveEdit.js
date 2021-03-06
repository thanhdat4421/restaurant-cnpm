import {useState} from 'react';
import '../scss/reserveedit.scss'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Edit from '@material-ui/icons/Edit'
import TextField from '@material-ui/core/TextField';
import verifyToken from '../midlewares/verifyToken';
import axios from 'axios';
const SERVER = "http://localhost:4000/";

const style = {
  position: 'absolute',
  top: window.innerWidth <= 500 ? '55%' : '50%',
  left: '50%',
  transform: window.innerWidth <= 800 ? 'translate(-50%, -60%)' : 'translate(-50%, -50%)',
  width: window.innerWidth <= 800 ? '85%' : '50%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: window.innerWidth <= 500 ? 3 : 5,
}; 

export default function BasicModal(props) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({
    firstName: props.firstName,
    lastName: props.lastName,
    phone: props.phone,
    email: props.email
  })

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOnchangeFirstName = (e) => setInfo({...info, firstName: e.target.value});
  const handleOnchangeLastName = (e) => setInfo({...info, lastName: e.target.value});
  const handleOnchangePhone = (e) => setInfo({...info, phone: e.target.value});
  const handleOnchangeEmail = (e) => setInfo({...info, email: e.target.value});

  const handleUpdate = (id) => {
    try {
      let req = {
        url: SERVER + "reserve/" + id,
        method: "PUT",
        data: info
      };
      axios.request(req).then(() => {
        const getInfo = verifyToken();
          if (getInfo) {
            getInfo.then(res => {
                if (res.data.permission === 'clerk') {
                    props.getData();
                }
                else if (res.data.permission === 'customer') {
                    props.getData(res.data.email);
                }
            })
          }
      });
    } catch (err) {
        console.log(err);
    }
    setOpen(false);
  }

  return (
    <div>
      <Button onClick={handleOpen}><Edit fontSize={window.innerWidth <= 500 ? "medium" : "large" }/></Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <div className="title">
            <Typography id="modal-modal-title" variant="h3" style={{fontWeight: 'bold', color: '#000a43'}}>Ch???nh s???a th??ng tin ?????t b??n</Typography>    
          </div>

          <div className="form-edit">
            <TextField
                variant="outlined" 
                label="H???, t??n ?????m" 
                type="text"
                fullWidth
                defaultValue={props.fname}
                onChange={handleOnchangeFirstName}
                InputProps={{style: {fontSize: 17}}}
                InputLabelProps={{style: {fontSize: 17}}}/>
          </div>

          <div className="form-edit">
            <TextField
                variant="outlined" 
                label="T??n" 
                type="text"
                fullWidth
                defaultValue={props.lname}
                onChange={handleOnchangeLastName}
                InputProps={{style: {fontSize: 17}}}
                InputLabelProps={{style: {fontSize: 17}}}/>
          </div>

          <div className="form-edit">
            <TextField
                variant="outlined" 
                label="S??? ??i???n tho???i" 
                type="tel"
                fullWidth
                defaultValue={props.phone}
                onChange={handleOnchangePhone}
                InputProps={{style: {fontSize: 17}}}
                InputLabelProps={{style: {fontSize: 17}}}/>
          </div>

          <div className="form-edit">
            <TextField
                variant="outlined" 
                label="?????a ch??? Email" 
                type="email"
                fullWidth
                defaultValue={props.email}
                onChange={handleOnchangeEmail}
                InputProps={{style: {fontSize: 17}}}
                InputLabelProps={{style: {fontSize: 17}}}/>
          </div>

          <div className="btn-edit">
            <Button 
              variant="contained" 
              fullWidth style={{ fontSize: 14, padding: 12}} 
              color="secondary"
              onClick={() => handleUpdate(props.id)} >L??u thay ?????i</Button>
          </div>
          
          <div className="note">
              <p>*L??u ??: N???u qu?? kh??ch mu???n thay ?????i th???i gian ?????t b??n, vui l??ng x??a l???n ?????t b??n c?? v?? th??m m???t ?????t b??n m???i.</p>
          </div>
        </Box>
      </Modal>
    </div>
  );
}