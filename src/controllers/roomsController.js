import app from "../app";
import { Server } from 'socket.io';
import http from 'http';
const server = http.createServer(app);
import Users from "../models/Users";

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


const rooms = [
    {
        room_id: 1,
        room_url: "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
        players_amount: 0,
        players: [],
        last_played: "",
        matrix: [ [,,], [,,], [,,] ]
    },
    {
        room_id: 2,
        room_url: "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
        players_amount: 0,
        players: [],
        last_played: "",
        matrix: [ [,,], [,,], [,,] ]
    },
    {
        room_id: 3,
        room_url: "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
        players_amount: 0,
        players: [],
        last_played: "",
        matrix: [ [,,], [,,], [,,] ]
    },
    {
        room_id: 4,
        room_url: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
        players_amount: 0,
        players: [],
        last_played: "",
        matrix: [ [,,], [,,], [,,] ]
    },
]

const verify = (form, matriz) => {
    let slots_null = 0;
    for (let linha=0; linha < 3; linha++) {
        let ver_linha = 0;
        let ver_coluna = 0;
        let ver_diagonal_principal = 0;
        let ver_diagonal_secundaria = 0;
        for (let coluna = 0; coluna < 3; coluna++) {

            //Verifica se esta vazio
            if(!matriz[linha][coluna]){
                slots_null += 1;
            }

            //Verifica nas linhas
            if (form === matriz[linha][coluna]) {
                ver_linha += 1;
                if (ver_linha === 3) {
                    return [ true, ];
                }
            }

            //Verifica nas colunas
            if (form === matriz[coluna][linha]) {
                ver_coluna += 1;
                if (ver_coluna === 3) {
                    return [ true, ];
                }
            }

            //Verifica na diagonal Principal
            if (form === matriz[coluna][coluna]) {
                ver_diagonal_principal += 1;
                if (ver_diagonal_principal === 3) {
                    return [ true, ];
                }
            }

            //Verifica na diagonal Secundaria
            if (form === matriz[0][2] && form === matriz[1][1] && form === matriz[2][0]) {
                ver_diagonal_secundaria += 1;
                if (ver_diagonal_secundaria === 3) {
                    return [ true, ];
                }
            }
        }
    }
    if(slots_null === 0) {
        return [ false, true ]
    }
    return [ false, false ]
}

io.on("connection", socket => {
    let username = "";

    const update_rooms = () => io.emit("rooms.status", rooms)
    update_rooms();

    socket.on("game", data => {

        const forms = ["X", "O"]

        let room_id = rooms.find(room => {
            return room.room_url === data.room_url
        }).room_id - 1;

        username = data.username

        if (!rooms[room_id].players.includes(username))
            rooms[room_id].players.push(username);

        const update_game = () => io.emit("game.room", rooms[room_id]);

        io.emit("game.form", {form: forms[rooms[room_id].players.indexOf(username)]});

        const update_game_matrix = () => io.emit("matrix", rooms[room_id].matrix);

        update_rooms();
        update_game();
        update_game_matrix();

        socket.on("matrix.slot", async data => {
            const player_index = rooms[room_id].players.indexOf(username)

            if (player_index < 2) {
                const form = forms[player_index];
                console.log(player_index, form, username !== rooms[room_id].last_played)
                if(username !== rooms[room_id].last_played) {
                    rooms[room_id].last_played = username;
    
                    if (!rooms[room_id].matrix[data.i][data.j]){
                        rooms[room_id].matrix[data.i][data.j] = form;
                    }
                    
                    const [ winner, even ] = verify(form, rooms[room_id].matrix);
                    if (winner || even) {
                        rooms[room_id].matrix = [
                            [,,],
                            [,,],
                            [,,]
                        ];
        
                        if (winner) {

                            const user = await Users.findOne({
                                where: {
                                    username
                                }
                            });
                            user.score += 1;
                            await user.save();

                            io.emit("game.winner", { message: `${username} Venceu!`});
                        }
                        else {
                            io.emit("game.winner", { message: `Empate`});
                        }
                    }
        
                    update_game_matrix();
                }
                io.emit("game.instead_of_playing", rooms[room_id].last_played);
            }
        });

        socket.on("disconnect", socket => {
            const player_index = rooms[room_id].players.indexOf(username);

            rooms[room_id].players = rooms[room_id].players.filter(player => player !== username);
            rooms[room_id].last_played = "";

            if (player_index < 2) {
                
                rooms[room_id].matrix = [
                    [,,],
                    [,,],
                    [,,]
                ];

                update_game();
                update_game_matrix();
            }
        });
    });
});

export default server;
