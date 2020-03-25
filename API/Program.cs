using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Codigo anterior por defecto
            //CreateHostBuilder(args).Build().Run();

            // Para migraciones automaticas
            var host = CreateHostBuilder(args).Build();
            // using Microsoft.Extensions.DependencyInjection; para CreateScope()
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    // using Persistence; para DataContext
                    var context = services.GetRequiredService<DataContext>();
                    // using Microsoft.EntityFrameworkCore; para Migrate()
                    // Migrate() aplica toda migracion pendiente sobre la DB
                    // Si la DB no existe la crea
                    context.Database.Migrate();
                }
                // Si encontramos una exepcion la vamos a atrapar
                catch (System.Exception ex)
                {
                    // Mostraremos la exepcion por medio de la consola con un ILogger
                    // El ILogger lo llamamos desde los servicios (inyeccion)
                    // Especificamos que el logger lo usaremos desde la clase Program
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occured during migration");
                }
            }
            // Ejecutara la aplicacion
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
