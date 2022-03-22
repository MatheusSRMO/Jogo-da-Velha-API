
import server from './controllers/roomsController';

const port = process.env.PORT || 30001

server.listen(port, () => {
    console.log("O servidor esta rodando em http://localhost:3001/");
    console.log("Para encerrar precione CRTL + C");
    console.log("Good Code :)");
})