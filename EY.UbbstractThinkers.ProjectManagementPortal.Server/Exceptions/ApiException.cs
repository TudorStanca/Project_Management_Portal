using System;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Exceptions
{
    public class ApiException : Exception
    {
        public ApiException(string message)
            : base(message)
        {
        }
    }
}
