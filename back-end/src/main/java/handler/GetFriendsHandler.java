package handler;

import dao.ConversationDao;
import dao.UserDao;
import dto.ConversationDto;
import dto.UserDto;
import handler.AuthFilter.AuthResult;
import org.bson.Document;
import request.ParsedRequest;
import response.HttpResponseBuilder;
import response.RestApiAppResponse;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class GetFriendsHandler implements BaseHandler {

    @Override
    public HttpResponseBuilder handleRequest(ParsedRequest request) {
        ConversationDao conversationDao = ConversationDao.getInstance();
        UserDao userDao = UserDao.getInstance();

        AuthResult authResult = AuthFilter.doFilter(request);
        if(!authResult.isLoggedIn){
            return new HttpResponseBuilder().setStatus(StatusCodes.UNAUTHORIZED);
        }

        // gets the user that pressed the "Show Friends" button
        String currentUser = request.getQueryParam("currentUser");

        var filter = new Document("userName", currentUser);

        List<ConversationDto> convo = conversationDao.query(filter);
        Iterator<ConversationDto> check = convo.iterator();

        List<UserDto> friends = new ArrayList<>();

        while (check.hasNext()) {
            String message = check.next().getConversationId();
            String[] split = message.split("_");
            // will add the other user to the list
            if (split[0].equals(currentUser)) {
                friends.add(userDao.query(new Document("userName", split[1])).get(0));
            } else {
                friends.add(userDao.query(new Document("userName", split[0])).get(0));
            }
        }

        // returns list of people the user has been in a conversation with
        var res = new RestApiAppResponse<>(true, friends, null);
        return new HttpResponseBuilder().setStatus("200 OK").setBody(res);
    }

}
