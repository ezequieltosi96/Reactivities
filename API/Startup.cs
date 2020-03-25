using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // Este metodo es nuestro inyector de dependencia. Aqui se usara el inyector
        public void ConfigureServices(IServiceCollection services)
        {
            // using Persistence; para la clase DataContext
            services.AddDbContext<DataContext>( options => {
                // using Microsoft.EntityFrameworkCore; para UseSqlite(conectionstring)
                // La cadena de conexion la obtiene de las configuraciones del proyecto
                // Estas configuraciones estan en el archivo appsettings.json
                options.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        // Configuracion del proyecto
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                // Pantalla de exepciones de desarrollador
                app.UseDeveloperExceptionPage();
            }

            // Redirige toda peticion HTTP a una peticion HTTPS (Certificado de seguridad)
            // En este curso la comentaremos ya que no vamos a usar certificados
            app.UseHttpsRedirection();
            // Como comentamos esta linea, en Properties/launchSettings.json quitamos el puerto que escucha la peticion HTTPS
            // https://localhost:5001;

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
