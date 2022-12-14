package handler;

import request.ParsedRequest;

public class HandlerFactory {
  // routes based on the path. Add your custom handlers here
  public static BaseHandler getHandler(ParsedRequest request) {
    switch (request.getPath()) {
      case "/createUser":
        return new CreateUserHandler();
      case "/login":
        return new LoginHandler();
      case "/getConversations":
        return new GetConversationsHandler();
      case "/getConversation":
        return new GetConversationHandler();
      case "/createMessage":
        return new CreateMessageHandler();
      // this case will return a list of messages depending on what the user searched
      case "/getMessages":
        return new GetMessagesHandler();
      case "/getUsers":
        return new GetUsersHandler();
      case "/editMessage":
        return new EditMessageHandler();
      // this case will return a list of who the user is in a conversation with
      case "/getFriends":
        return new GetFriendsHandler();
      case "/changePassword":
        return new ChangePasswordHandler();
      default:
        return new FallbackHandler();
    }
  }

}
