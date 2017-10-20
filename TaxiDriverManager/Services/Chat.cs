namespace TaxiDriverManager.Services
{
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.SignalR;
    using System;
    using Microsoft.AspNetCore.SignalR.Client;

    namespace Sample
    {
        public class Chat : Hub
        {
            public Task Send(string message)
            {
                return Clients.All.InvokeAsync("Send", message);
            }

            public static async Task sendtoclientAsync() {
                var connection = new HubConnectionBuilder()
                .WithUrl("http://localhost:60458/chat")
                .WithConsoleLogger()
                .Build();

                //connection.On<string>("Send", data =>
                //{
                //    Console.WriteLine($"Received: {data}");
                //});

                //await connection.StartAsync();

                await connection.InvokeAsync("Send", "Hello");
            }
        }
    }
}
