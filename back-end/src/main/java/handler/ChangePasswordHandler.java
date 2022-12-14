package handler;

import dao.UserDao;
import dto.UserDto;
import org.apache.commons.codec.digest.DigestUtils;
import org.bson.Document;
import request.ParsedRequest;
import response.HttpResponseBuilder;
import response.RestApiAppResponse;

public class ChangePasswordHandler implements BaseHandler{

    @Override
    public HttpResponseBuilder handleRequest(ParsedRequest request) {
        UserDto userDto = GsonTool.gson.fromJson(request.getBody(), dto.UserDto.class);
        UserDao userDao = UserDao.getInstance();

        var query = new Document("userName", userDto.getUserName());
        RestApiAppResponse res;
        var resultQ = userDao.query(query);
        System.out.println(resultQ);
        if (resultQ.size() == 0) {
            res = new RestApiAppResponse<>(false, null, "Password not modified");
        } else {
            System.out.println(resultQ.get(0).getPassword());
            userDto.setPassword(DigestUtils.sha256Hex(userDto.getPassword()));
            userDao.changePassword(userDto, userDto.getPassword());
            System.out.println(resultQ.get(0).getPassword());
            res = new RestApiAppResponse<>(true, null, "Password modified");
        }
        return new HttpResponseBuilder().setStatus("200 OK").setBody(res);
    }
}