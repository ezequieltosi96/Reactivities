using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    // Todo controlador de API tiene su ruta (como acceder a el)
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly DataContext _context;

        // using Persistence; para DataContext
        // en el constructor se hacen las inyecciones
        public ValuesController(DataContext context)
        {
            _context = context;
        }
        // lo que tenemos ahora es acceso al DataContext desde el controlador

        // GET api/values
        [HttpGet]
        // using Domain; para Value
        public async Task<ActionResult<IEnumerable<Value>>> Get()
        {
            // using Microsoft.EntityFrameworkCore; para ToListAsync()
            var values = await _context.Values.ToListAsync();
            return Ok(values);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Value>> Get(int id)
        {
            var value = await _context.Values.SingleOrDefaultAsync(val => val.Id == id);
            // Tambien puede ser -> var value = await _context.Values.FindAsync(id);
            return Ok(value);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}