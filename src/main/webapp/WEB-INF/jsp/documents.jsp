<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:forEach items="${documents}" var="doc">
     <div class="document content-area">
         <span class="title">${doc.title}</span>
         <ul>
             <li><a href="<c:url value="/apps/download"><c:param name="id" value="${doc.id}"/><c:param name="query" value="${query}"/></c:url>">Id: ${doc.id}</a></li>
             <li>Content-Type: ${doc.contentType}</li>
             <li>Author: ${doc.author}</li>
             <li>Last-Modified: ${doc.lastModified}</li>
         </ul>
         <div class="result-body">${doc.matchedSection}</div>
     </div>
</c:forEach>