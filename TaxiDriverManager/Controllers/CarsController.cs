using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaxiDriverManager.Data;
using TaxiDriverManager.Models;

namespace TaxiDriverManager.Controllers
{
    [Produces("application/json")]
    [Route("api/Cars")]
    public class CarsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CarsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Cars
        [HttpGet]
        public IEnumerable<Cars> GetCars()
        {
            return _context.Cars;
        }

        // GET: api/Cars/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCars([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cars = await _context.Cars.SingleOrDefaultAsync(m => m.Id == id);

            if (cars == null)
            {
                return NotFound();
            }

            return Ok(cars);
        }

        // PUT: api/Cars/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCars([FromRoute] int id, [FromBody] Cars cars)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            cars.Id = id;
            if (id != cars.Id)
            {
                return BadRequest();
            }

            _context.Entry(cars).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Cars
        [HttpPost]
        public async Task<IActionResult> PostCars([FromBody] Cars cars)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Cars.Add(cars);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCars", new { id = cars.Id }, cars);
        }

        // DELETE: api/Cars/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCars([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cars = await _context.Cars.SingleOrDefaultAsync(m => m.Id == id);
            if (cars == null)
            {
                return NotFound();
            }

            _context.Cars.Remove(cars);
            await _context.SaveChangesAsync();

            return Ok(cars);
        }

        private bool CarsExists(int id)
        {
            return _context.Cars.Any(e => e.Id == id);
        }
    }
}