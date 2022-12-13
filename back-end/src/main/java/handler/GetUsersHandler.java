package handler;

import dao.MessageDao;
import dao.UserDao;
import org.bson.Document;
import request.ParsedRequest;
import response.HttpResponseBuilder;
import response.RestApiAppResponse;

import java.util.ArrayList;
import java.util.List;

public class GetUsersHandler implements BaseHandler{
    @Override
    public HttpResponseBuilder handleRequest(ParsedRequest request) {
        UserDao userDao = UserDao.getInstance();

        List<String> names = new ArrayList<String>();   // list for the userNames found
        var users = userDao.getAll();
        for(Document d: users){
            if(d.getString("userName").toLowerCase().contains
                    (request.getQueryParam("userNameSearch").toString().toLowerCase())){
                names.add(d.getString("userName"));

            }
        }

        var res = new RestApiAppResponse(true, names, null);
        return new HttpResponseBuilder().setStatus("200 OK").setBody(res);
    }
}
