using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Services.Interfaces
{
    public interface IUserService
    {
        Task<User> UpdateUser(string id, User user);
    }
}
