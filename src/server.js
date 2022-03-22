
import server from './controllers/roomsController';


server.listen(3001, () => {
    console.log("O servidor esta rodando em http://localhost:3001/");
    console.log("Para encerrar precione CRTL + C");
    console.log("Good Code :)");
})