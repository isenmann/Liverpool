import * as signalR from "@microsoft/signalr";

class LiverpoolHubService {
    
    constructor() {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("/liverpoolHub")
            .configureLogging(signalR.LogLevel.Information)
            .build();
        hubConnection.start();
        this.connection = hubConnection;
    }

    setUserName(username) {
        this.connection.invoke("SetUserName", username);
    }

    getAllUsers() {
        this.connection.invoke("GetAllUsers");
    }

    getAllNotStartedGames() {
        this.connection.invoke("GetAllNotStartedGames");
    }

    createGame(gameName) {
        this.connection.invoke("CreateGame", gameName);
    }

    joinGame(gameName) {
        this.connection.invoke("JoinGame", gameName);
    }

    startGame(gameName) {
        this.connection.invoke("StartGame", gameName);
    }

    discardCard(gameName, cardName) {
        this.connection.invoke("DiscardCard", gameName, cardName);
    }

    drawCardFromDiscardPile(gameName, cardName) {
        this.connection.invoke("DrawCardFromDiscardPile", gameName, cardName);
    }

    drawCardFromDrawPile(gameName) {
        this.connection.invoke("DrawCardFromDrawPile", gameName);
    }

    dropCard(gameName, cardName) {
        this.connection.invoke("DropCard", gameName, cardName);
    }

    registerGetAllUsers(allUsers) {
        this.connection.on('AllUsers', (userNames) => {
            allUsers(userNames);
        });
    }

    registerUserConnected(userConnected) {
        this.connection.on('UserConnected', (user) => {
            userConnected(user);
        });
    }

    registerUserDisconnected(userDisconnected) {
        this.connection.on('UserDisconnected', (disconnectedUser, users) => {
            userDisconnected(disconnectedUser, users);
        });
    }

    registerUserSetName(userSetName) {
        this.connection.on('UserSetName', (userNames) => {
            userSetName(userNames);
        });
    }

    registerGameCreated(gameCreated) {
        this.connection.on('GameCreated', (allNotStartedGames) => {
            gameCreated(allNotStartedGames);
        });
    }

    registerGameJoined(gameJoined) {
        this.connection.on('UserJoinedGame', (allNotStartedGames) => {
            gameJoined(allNotStartedGames);
        });
    }

    registerGameStarted(gameStarted) {
        this.connection.on('GameStarted', (gameName) => {
            gameStarted(gameName);
        });
    }

    registerAllNotStartedGames(notStartedGames) {
        this.connection.on('AllNotStartedGames', (allNotStartedGames) => {
            notStartedGames(allNotStartedGames);
        });
    }

    registerGameUpdated(gameUpdated) {
        this.connection.on('GameUpdate', (game) => {
            gameUpdated(game);
        });
    }
}

const LiverpoolService = new LiverpoolHubService();

export default LiverpoolService;