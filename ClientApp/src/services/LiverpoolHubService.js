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
}

const LiverpoolService = new LiverpoolHubService();

export default LiverpoolService;