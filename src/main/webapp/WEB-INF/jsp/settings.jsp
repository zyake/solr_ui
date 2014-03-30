<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:forEach items="${settings}" var="setting">
  <tr>
      <td style="text-align: right;"><input type="text" maxlength="30" readonly="readonly" name="category" value="${setting.category}"/></td>
      <td><input type="text" maxlength="30" readonly="readonly" name="configKey" value="${setting.configKey}"/></td>
      <td><input type="text" maxlength="100" readonly="readonly" name="comment" value="${setting.comment}"/></td>
      <td><input class="input" type="text" maxlength="100" name="configValue" value="${setting.configValue}"/></td>
  </tr>
</c:forEach>