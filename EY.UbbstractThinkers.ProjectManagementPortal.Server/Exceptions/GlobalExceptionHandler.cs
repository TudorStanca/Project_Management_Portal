using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Exceptions
{
    public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            var problemDetails = new ProblemDetails();
            problemDetails.Instance = httpContext.Request.Path;

            if (exception is ApiException e)
            {
                httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                problemDetails.Title = e.Message;

                logger.LogWarning(exception, "Bad Request: {Message}", e.Message);
            }
            else
            {
                httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                problemDetails.Title = "A Server Error Has Ocurred";

                logger.LogError(exception, "Internal Server Error: {Message}", exception.Message);
            }

            problemDetails.Status = httpContext.Response.StatusCode;

            await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken).ConfigureAwait(false);

            return true;
        }
    }
}
