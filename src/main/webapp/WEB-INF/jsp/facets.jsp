<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:forEach items="${facets}" var="facet">
 <h3>${facet.facetField}</h3>
 <ul>
 <c:forEach items="${facet.facetMap}" var="facetMap">
  <li><span class="actionButton" field="${facet.facetField}" facet="${facetMap.key}"><img class="addImg" src="image/add.png"/><img class="stopImg" style="display:none;" src="image/stop.png"/></span>${facetMap.key}: ${facetMap.value}</li>
 </c:forEach>
 </ul>
</c:forEach>