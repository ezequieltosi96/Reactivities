using System;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        // Creamos un constructor que recibe DbContextOptions. 
        // Necesariamente necesitamos enviar options al constructor de la clase base (DbContext)
        public DataContext(DbContextOptions options) : base (options)
        {
            
        }

        // Declaramos las listas de entidades que luego se mapearan como tablas en la DB
        // Para poder hacer uso de las entidades necesitamos agregar una directiva using
        // using Domain;
        public DbSet<Value> Values { get; set; }

        public DbSet<Activity> Activities { get; set; }

        // sobreescribimos este metodo para plantar las semillas
        protected override void OnModelCreating(ModelBuilder builder){
            
            builder.Entity<Value>()
                .HasData(
                    new Value {Id=1, Name="Value 101"},
                    new Value {Id=2, Name="Value 102"},
                    new Value {Id=3, Name="Value 103"}
                );
        }
    }
}
