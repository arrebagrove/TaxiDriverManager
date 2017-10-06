using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaxiDriverManager.Data;
using TaxiDriverManager.Models;
using Microsoft.AspNetCore.Authorization;
using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;
using AspNet.Security.OAuth.Validation;

namespace TaxiDriverManager.Controllers
{
    [Produces("application/json")]
    [Route("api/Positions")]
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme)]
    public class PositionsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PositionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /*[Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme, Roles = "SuperAdmin"), HttpGet]
        public IActionResult GetPositions()
        {
            return Json(new
            {
                Subject = User.GetClaim(OpenIdConnectConstants.Claims.Subject),
                Role = User.GetClaim(OpenIdConnectConstants.Claims.Role),
                Name = User.Identity.Name
            });
        } */

        // GET: api/Positions
        [HttpGet]
        public IEnumerable<Positions> GetPositions()
        {
            return _context.Positions; //.Include(pos => pos.Driver);
        } 

        // GET: api/Positions/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPositions([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var positions = await _context.Positions.SingleOrDefaultAsync(m => m.Id == id);

            if (positions == null)
            {
                return NotFound();
            }

            return Ok(positions);
        }

        // PUT: api/Positions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPositions([FromRoute] int id, [FromBody] Positions positions)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != positions.Id)
            {
                return BadRequest();
            }

            _context.Entry(positions).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PositionsExists(id))
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

        // POST: api/Positions
        [HttpPost]
        public async Task<IActionResult> PostPositions([FromBody] Positions positions)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (positions.TimeStamp == null) {
                positions.TimeStamp = DateTime.Now;
            }

            var email = User.Identity.Name; // User.GetClaim(OpenIdConnectConstants.Claims.Email);
            var driverID = _context.Drivers.Single(d => d.Email == email).Id;
            positions.DriverId = driverID;

            _context.Positions.Add(positions);
            await _context.SaveChangesAsync();

            return Ok(positions.DriverId);
        }

        [HttpPost("Status")]
        public async Task<IActionResult> SetStatus([FromBody] Status s)
        {

            Console.WriteLine("----------------------------------------------------------------------------------");
            Console.WriteLine(s);
            Console.WriteLine("----------------------------------------------------------------------------------");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Console.WriteLine("----------------------------------------------------------------------------------");
            Console.WriteLine(s);
            Console.WriteLine("----------------------------------------------------------------------------------");
            var email = User.Identity.Name; // User.GetClaim(OpenIdConnectConstants.Claims.Email);
            var driverID = _context.Drivers.Single(d => d.Email == email).Id;

            var drivers = await _context.Drivers.SingleOrDefaultAsync(m => m.Id == driverID);
            drivers.CurrentStatus = s.currentStatus;
            await _context.SaveChangesAsync();

            return Ok(drivers.CurrentStatus);
        }

        // DELETE: api/Positions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePositions([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var positions = await _context.Positions.SingleOrDefaultAsync(m => m.Id == id);
            if (positions == null)
            {
                return NotFound();
            }

            _context.Positions.Remove(positions);
            await _context.SaveChangesAsync();

            return Ok(positions);
        }

        private bool PositionsExists(int id)
        {
            return _context.Positions.Any(e => e.Id == id);
        }
    }

    public class Status {
        public string currentStatus { get; set; }
    }
}