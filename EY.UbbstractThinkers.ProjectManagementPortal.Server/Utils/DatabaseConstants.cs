using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System;
using System.Collections.Generic;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Utils
{
    public static class DatabaseConstants
    {
        public static readonly List<Stage> Stages =
        [
            new() { Uid = new Guid("2402BF5A-48A2-411E-B226-EE7CC32F1C84"), Name = "Initiate", Description = "Initiate the project", OrderNumber = 1 },
            new() { Uid = new Guid("3A38E6E3-B685-49AC-A64C-A0A2574C2A41"), Name = "Plan", Description = "Plan the project", OrderNumber = 2 },
            new() { Uid = new Guid("45FAF5B0-4AF5-45F8-BDA1-79C14498DFBD"), Name = "Execute", Description = "Execute the project", OrderNumber = 3 },
            new() { Uid = new Guid("B5D06184-6D8D-4DEE-B310-ACE6906E9882"), Name = "Monitor", Description = "Monitor the project", OrderNumber = 4 },
            new() { Uid = new Guid("7402E745-2EAC-4D68-81F1-236CC1BA23D7"), Name = "Close", Description = "Close the project", OrderNumber = 5 }
        ];
    }
}
