using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaxiDriverManager.Data;
using TaxiDriverManager.Models;
using System.Data.SqlClient;
using System.Data;

namespace TaxiDriverManager.Controllers
{
    [Produces("application/json")]
    [Route("api/Drivers")]
    public class DriversController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DriversController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Drivers
        [HttpGet]
        public IEnumerable<Drivers> GetDrivers()
        {
            return _context.Drivers.Include(driver => driver.Car);
        }

        // GET: api/Drivers
        [HttpGet]
        [Route("ActiveDrivers")]
        public IActionResult GetActiveDrivers()
        {
            var drivs = _context.Drivers.Include(d => d.Car).Where(d => d.Positions != null).Where(d => d.CurrentStatus != "Inactive")
                    .Select(x => new { Drivers = x, Positions = x.Positions.Where(p => p.TimeStamp == x.Positions.Max(y => y.TimeStamp)).SingleOrDefault() });


            //var drivers = _context.Drivers.FromSql("select Lastname +' ' + Firstname as 'Name'," +
            //    " currentStatus, Area, q.maxtime " +
            //    "from Positions p " +
            //    " inner join Drivers d on p.DriverId = d.id " +
            //    "inner join (select DriverId, max(p.TimeStamp) as 'maxtime'" +
            //    " from Positions p group by DriverId) q on q.DriverId = p.DriverId and q.maxtime = p.TimeStamp " +
            //    "where currentStatus in ('Free', 'Busy')").ToList();

            return Json(drivs.ToList());

        }

        // GET: api/Drivers/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDrivers([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var drivers = await _context.Drivers.Include(driver => driver.Car).SingleOrDefaultAsync(m => m.Id == id);

            if (drivers == null)
            {
                return NotFound();
            }

            return Ok(drivers);
        }

        // PUT: api/Drivers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDrivers([FromRoute] int id, [FromBody] Drivers drivers)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            drivers.Id = id;
            if (id != drivers.Id)
            {
                return BadRequest();
            }
            drivers.CurrentStatus = _context.Drivers.Where(m => m.Id == id).Select(d => d.CurrentStatus).SingleOrDefault();
            _context.Entry(drivers).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DriversExists(id))
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

        // POST: api/Drivers
        [HttpPost]
        public async Task<IActionResult> PostDrivers([FromBody] Drivers drivers)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Drivers.Add(drivers);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDrivers", new { id = drivers.Id }, drivers);
        }

        // DELETE: api/Drivers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDrivers([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var drivers = await _context.Drivers.SingleOrDefaultAsync(m => m.Id == id);
            if (drivers == null)
            {
                return NotFound();
            }

            _context.Drivers.Remove(drivers);
            await _context.SaveChangesAsync();

            return Ok(drivers);
        }

        private bool DriversExists(int id)
        {
            return _context.Drivers.Any(e => e.Id == id);
        }
    }
}