import * as signalR from "@microsoft/signalr";

class LiverpoolHubService {

    constructor() {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("/liverpoolHub")
            .withAutomaticReconnect([500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 15000, 20000, null])
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

    dropCards(gameName) {
        this.connection.invoke("DropCards", gameName);
    }

    dropCardAtPlayer(gameName, cardName, playerName, dropAreaName) {
        this.connection.invoke("DropCardAtPlayer", gameName, cardName, playerName, dropAreaName);
    }

    takeBackPlayersCard(gameName, cardName, index) {
        this.connection.invoke("TakeBackPlayersCard", gameName, cardName, index);
    }

    nextRound(gameName) {
        this.connection.invoke("NextRound", gameName);
    }

    sortPlayerCards(gameName, oldIndex, newIndex) {
        this.connection.invoke("SortPlayerCards", gameName, oldIndex, newIndex);
    }

    knock(gameName) {
        this.connection.invoke("Knock", gameName);
    }

    knockFeedback(gameName, feedback){
        this.connection.invoke("KnockFeedback", gameName, feedback);
    }

    askToKeepCard(gameName, cardName) {
        this.connection.invoke("AskToKeepCard", gameName, cardName);
    }

    keepCardFeedback(gameName, feedback) {
        this.connection.invoke("KeepCardFeedback", gameName, feedback);
    }

    reconnectUser(gameName, username) {
        this.connection.invoke("ReconnectUser", gameName, username);
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