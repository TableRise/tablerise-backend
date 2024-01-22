const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));
const rooms = {}; // Inicializa a variável rooms
io.on('connection', (socket) => {
    console.log('Novo usuário conectado');

    // Ouvinte de evento para entrada em uma sala
    socket.on('join', (room) => {
        socket.join(room); // Coloca o usuário na sala especificada

        // Emite o evento 'initial state' com as mensagens e objetos iniciais para eles seram criado assim que entrar na sala
        const roomData = rooms[room] || { messages: [], objects: [], imagens: []};
        socket.emit('initial state', roomData.messages, roomData.objects, roomData.imagens);
    });

    // Ouvinte de evento para mensagens de chat
    socket.on('chat message', (room, message) => {
        
        // Garante que rooms[room] está inicializado antes de acessar messages
        rooms[room] = rooms[room] || { messages: [], objects: [], imagens: [] };
        // Envia a mensagem para todos os usuários na sala especificada
        io.to(room).emit('chat message', message);
        
        // Adiciona a mensagem à lista de mensagens da sala
        rooms[room].messages.push(message);
    });

    // Ouvinte de evento para criar um quadrado
    socket.on('Create box', (room, quadradoID) => {

         // Garante que rooms[room] está inicializado antes de acessar messages
        rooms[room] = rooms[room] || { messages: [], objects: [], imagens: [] };
        // envia o envento para todas as pessoas na sala
        io.to(room).emit('Create box', quadradoID);

        rooms[room].objects.push({ elementID: quadradoID, position: { x: 0, y: 0 } });
    });

    // Ouvinte de evento para salvar o local e o tamanho do quadrado
    socket.on('save estate size and place', (room, objectInformation) => {
        rooms[room].objects = rooms[room].objects.map(object => 
            object.elementID === parseInt(objectInformation.elementID) ? { ...object, position: { x: objectInformation.left, y: objectInformation.top }, 
            size: { width: objectInformation.width, height: objectInformation.height } 
            } : object
          );
       
       
   });

    // Ouvinte de evento para deletar um quadrado
    socket.on('delete object', (room, elementID) => {
        // Remove o objeto da lista de objetos da sala
        rooms[room].objects.splice(rooms[room].objects.findIndex(item => item.elementID === parseInt(elementID)), 1);
        // envia o envento para todas as pessoas na sala
        io.to(room).emit('delete object', elementID);
        
    });

    // Ouvinte de evento para mover um quadrado
    socket.on('any object move', (room, coordinates, userID) => {
        // envia o envento para todas as pessoas na sala menos a pessoa que encaminhou
        io.to(room).except(userID).emit('any object move', coordinates.left, coordinates.top, coordinates.elementID);
    });

    // Ouvinte de evento para alterar o tamanho de um quadrado
    socket.on('any object Resizing', (room, size, userID) => {
        // envia o envento para todas as pessoas na sala menos a pessoa que encaminhou
        io.to(room).except(userID).emit('any object Resizing', size.width, size.height, size.elementID);

    });

    // Ouvir evento para mudança da imagem de fundo
    socket.on('changeBackground', (room, newBackground) => {
        // Salva a informação no objeto
        rooms[room].imagens.push(newBackground);
        // Emitir o evento para todos os clientes na sala
        io.to(room).emit('backgroundChanged', newBackground);
    });

    // Ouvir evento para mudar a imagem do jogador
    socket.on('uploadImage', (room, quadradoID, imageData) => {
        // Salva a informação no objeto
        rooms[room].objects = rooms[room].objects.map(object => 
            object.elementID === parseInt(quadradoID) ? { ...object, imagem: imageData 
            } : object
        );
        // Emitir o evento para todos os clientes na sala
        io.to(room).emit('updateObjectImage', quadradoID, imageData);
    });

    // Ouvinte de evento para desconexão de um usuário
    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });

});

// define em qual porta está "escutando"
server.listen(3000, () => {
    console.log('Servidor escutando na porta 3020');
});