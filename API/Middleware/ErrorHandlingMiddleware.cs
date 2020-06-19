using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;
        
        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context){
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExeptionAsync(context, ex, _logger);
            }
        }

        private async Task HandleExeptionAsync(HttpContext context, Exception ex, ILogger<ErrorHandlingMiddleware> logger)
        {
            object errors = null;

            switch(ex){
                case RestException re:
                    _logger.LogError(ex, "REST_ERROR");
                    errors = re.Errors;
                    context.Response.StatusCode = (int)re.Code;
                    break;
                case Exception e:
                    _logger.LogError(ex, "SERVER_ERROR");
                    errors = string.IsNullOrWhiteSpace(e.Message) ? "Error" : e.Message;
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }

            context.Response.ContentType = "application/Json";

            if(errors != null)
            {
                var result = JsonSerializer.Serialize(new { errors });

                await context.Response.WriteAsync(result);
            }
        }
    }
}