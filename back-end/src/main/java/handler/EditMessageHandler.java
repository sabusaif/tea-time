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

public class EditMessageHandler implements BaseHandler {

    @Override
    public HttpResponseBuilder handleRequest(ParsedRequest request) {
        // Authenticate
        MessageDto newMessageDto = GsonTool.gson.fromJson(request.getBody(), dto.MessageDto.class);
        MessageDao messageDao = MessageDao.getInstance();
        AuthResult authResult = AuthFilter.doFilter(request);
        if(!authResult.isLoggedIn){
            return new HttpResponseBuilder().setStatus(StatusCodes.UNAUTHORIZED);
        }

        // There is no unique id for message, so I'm just using the message/timestamp as the id
        var filter = new Document()
                .append("message", newMessageDto.getMessage())
                .append("timestamp", newMessageDto.getTimestamp());
        messageDao.update(filter, request.getQueryParam("newMessage"));

        return new HttpResponseBuilder().setStatus("200 OK");
    }

}
