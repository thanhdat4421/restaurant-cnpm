import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import '../scss/clerk.scss';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import verifyToken from '../midlewares/verifyToken';
import socketClient from "socket.io-client";
import getOrder from '../midlewares/getOrder';
import classNames from 'classnames';
const SERVER = "http://127.0.0.1:4000/";
var socket = null;

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleTimeString() + ' ' + new Date(dateString).toLocaleDateString();
}
function format(n, currency) {
    if (n && currency)
        return n.toFixed(0).replace(/./g, function (c, i, a) {
            return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
        }) + currency;
}
export default function Kitchen() {
    const [data, setData] = useState(null);
    const [filter, setFilter] = useState('cooking');
    const history = useHistory();
    function getData(filter) {
        var order = getOrder('', filter);
        if (order) {
            order.then(res => {
                if (res.data.order) {
                    setData([...res.data.order]);
                    setFilter(filter);
                }
            })
        }
    }
    useEffect(() => {
        const getInfo = verifyToken();
        if (getInfo) {
            getInfo.then(res => {
                if (res.data.permission !== 'kitchen') {
                    history.push("/login");
                }
                else {
                    getData(filter);
                    try {
                        socket = socketClient(SERVER);
                        socket.on('kitchen', () => {
                            getData(filter);
                        })
                    }
                    catch (err) {
                        console.log(err)
                    }
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    async function handleClick(status, orderID) {
        if (socket) {
            await socket.emit(`${status}`, orderID);
            getData(filter);
        }
    }
    return (
        <div className="kitchen">
            <div >
                <div className='body'>
                    <div className='filter'>
                        <div className='header'>
                            <Link to='/'>
                                <HomeIcon />
                                <span>V??? trang ch???</span>
                            </Link>
                        </div>
                        <div className="wrapper">
                            <span className={classNames({ active: filter === 'cooking' })} onClick={() => getData('cooking')}>??ang n???u</span>
                            <span className={classNames({ active: filter === 'done' })} onClick={() => getData('done')}>???? n???u xong</span>
                        </div>
                        <p>Danh s??ch ????n h??ng</p>
                    </div>
                    <table>
                        <tr>
                            <th>STT</th>
                            <th>OrderID</th>
                            <th>Qu?? tr??nh</th>
                            <th>T???ng ti???n</th>
                            <th>Kh???i t???o v??o</th>
                            <th>C???p nh???t v??o</th>
                            {filter === 'cooking' && <th>Ho??n th??nh</th>}
                        </tr>
                        {data && data.map((val, idx) => (
                            <tr>
                                <td>{idx}</td>
                                <td>{val.orderID}</td>
                                <td>{val.process}</td>
                                <td>{format(val.total, '??')}</td>
                                <td>{formatDate(val.createdAt)}</td>
                                <td>{formatDate(val.updatedAt)}</td>
                                {
                                    filter === 'cooking' &&
                                    <td>
                                        <Button className='btn-modal'
                                            disabled={val.status === 'done'}
                                            variant="contained" color="secondary"
                                            onClick={() => handleClick('done', val.orderID)}
                                        >N???u xong</Button>
                                    </td>
                                }
                            </tr>
                        )
                        )}
                    </table>
                </div>
            </div>
        </div>
    )
}