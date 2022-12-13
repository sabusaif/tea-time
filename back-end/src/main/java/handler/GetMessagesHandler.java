package handler;

import dao.ConversationDao;
import dao.MessageDao;
import dto.ConversationDto;
import dto.MessageDto;
import handler.AuthFilter.AuthResult;
import org.bson.Document;
import request.ParsedRequest;
import response.CustomHttpResponse;
import response.HttpResponseBuilder;
import response.RestApiAppResponse;

import java.util.Iterator;
import java.util.List;

public class GetMessagesHandler implements BaseHandler {

    @Override
    public HttpResponseBuilder handleRequest(ParsedRequest request) {
        MessageDao messageDao = MessageDao.getInstance();
        AuthResult authResult = AuthFilter.doFilter(request);

        if(!authResult.isLoggedIn){
            return new HttpResponseBuilder().setStatus(StatusCodes.UNAUTHORIZED);
        }

        var filter = new Document("conversationId", request.getQueryParam("conversationId"));

        List<MessageDto> convo = messageDao.query(filter);
        Iterator<MessageDto> check = convo.iterator();

        // this is what the user had searched
        String search = request.getQueryParam("search");

        while (check.hasNext()) {
            String message = check.next().getMessage();
            // not case sensitive
            if (!message.toUpperCase().contains(search.toUpperCase())) {
                // if it isn't the same, the message will be removed from the list
                check.remove();
            }
        }

        // returns list of messages that included the search word
        var res = new RestApiAppResponse<>(true, convo, null);
        return new HttpResponseBuilder().setStatus("200 OK").setBody(res);
    }

}
